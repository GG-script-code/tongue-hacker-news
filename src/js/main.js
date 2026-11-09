import { HackerNewsRepository } from '@/js/api/HackerNewsRepository.js';
import { NewsRenderer } from '@/js/ui/NewsRenderer.js';
import { LoadMoreButton } from '@/js/ui/LoadMoreButton.js';
import { ThemeManager } from '@/js/ui/ThemeManager.js';
import { SearchBar } from '@/js/ui/SearchBar.js';
import { BackToTop } from '@/js/ui/BackToTop.js';
import { NewsControls } from '@/js/ui/NewsControls.js';
import { getNextBatch } from '@/js/utils/pagination.js';
import { filterStories } from '@/js/utils/search.js';
import { sortStories, SORT_CRITERIA } from '@/js/utils/sortStories.js';
import { groupStoriesByDate } from '@/js/utils/groupByDate.js';
import { config } from '@/js/config.js';

const state = {
  allIds: [],
  page: 0,
  isLoading: false,
  exhausted: false,
  loadedStories: [],
  filters: {
    query: '',
    sortCriterion: SORT_CRITERIA.NEWEST_FIRST,
  },
};

const repository = new HackerNewsRepository();
const renderer = new NewsRenderer('#news-container');
const loadMoreButton = new LoadMoreButton('#load-more-btn');
const refreshButton = document.querySelector('#refresh-btn');

new ThemeManager('#theme-toggle');
new BackToTop('#back-to-top');

function applyFiltersAndRender() {
  if (state.loadedStories.length === 0) return;

  let result = state.loadedStories;

  if (String(state.filters.query).trim() !== '') {
    result = filterStories(result, state.filters.query);
  }

  const isDateSort =
    state.filters.sortCriterion === SORT_CRITERIA.NEWEST_FIRST ||
    state.filters.sortCriterion === SORT_CRITERIA.OLDEST_FIRST;

  if (isDateSort) {
    const sorted = sortStories(result, state.filters.sortCriterion);
    const groups = groupStoriesByDate(sorted);
    if (state.filters.sortCriterion === SORT_CRITERIA.OLDEST_FIRST) {
      groups.reverse();
    }
    renderer.renderStories(sorted, groups);
  } else {
    const sorted = sortStories(result, state.filters.sortCriterion);
    renderer.renderStories(sorted, null);
  }
}

new SearchBar('#search-input', (query) => {
  state.filters.query = query;
  applyFiltersAndRender();
});

new NewsControls({
  sortSelector: '#sort-select',
  onChange: ({ sortCriterion }) => {
    state.filters.sortCriterion = sortCriterion;
    applyFiltersAndRender();
  },
});

async function loadPage() {
  if (state.isLoading || state.exhausted) return;

  state.isLoading = true;
  loadMoreButton.disable();
  renderer.clearError();
  renderer.showLoading();

  try {
    const idsForPage = getNextBatch(state.allIds, state.page, config.pageSize);

    if (idsForPage.length === 0) {
      state.exhausted = true;
      loadMoreButton.hide();
      renderer.hideLoading();
      return;
    }

    const stories = await repository.getStoriesBatch(idsForPage);
    renderer.hideLoading();

    state.loadedStories = [...state.loadedStories, ...stories];

    applyFiltersAndRender();

    state.page += 1;

    const nextBatch = getNextBatch(state.allIds, state.page, config.pageSize);
    if (nextBatch.length === 0) {
      state.exhausted = true;
      loadMoreButton.hide();
    }
  } catch (error) {
    renderer.hideLoading();
    renderer.showError('Errore nel caricamento delle news. Riprova piu tardi.');
    console.error('Load error:', error);
  } finally {
    state.isLoading = false;
    if (!state.exhausted) {
      loadMoreButton.enable();
    }
  }
}

async function refreshNews() {
  if (state.isLoading) return;

  state.allIds = [];
  state.page = 0;
  state.exhausted = false;
  state.loadedStories = [];
  state.filters.query = '';

  const searchInput = document.querySelector('#search-input');
  if (searchInput) searchInput.value = '';

  renderer.clear();
  loadMoreButton.hide();
  loadMoreButton.enable();

  await init(true);
}

async function init(isRefresh = false) {
  renderer.showLoading();

  try {
    state.allIds = await repository.getNewStoryIds();
    renderer.hideLoading();

    if (state.allIds.length === 0) {
      renderer.showError('Nessuna news disponibile al momento.');
      return;
    }

    await loadPage();
    if (!isRefresh) {
      loadMoreButton.bindClick(loadPage);
    }
    loadMoreButton.show();
  } catch (error) {
    renderer.hideLoading();
    renderer.showError('Impossibile caricare le news. Controlla la connessione.');
    console.error('Init error:', error);
  }
}

refreshButton.addEventListener('click', () => refreshNews());

init();
