import { HackerNewsRepository } from '@/js/api/HackerNewsRepository.js';
import { NewsRenderer } from '@/js/ui/NewsRenderer.js';
import { LoadMoreButton } from '@/js/ui/LoadMoreButton.js';
import { ThemeManager } from '@/js/ui/ThemeManager.js';
import { SearchBar } from '@/js/ui/SearchBar.js';
import { BackToTop } from '@/js/ui/BackToTop.js';
import { getNextBatch } from '@/js/utils/pagination.js';
import { filterStories } from '@/js/utils/search.js';
import { config } from '@/js/config.js';

const state = {
  allIds: [],
  page: 0,
  isLoading: false,
  exhausted: false,
  loadedStories: [],
  searchQuery: '',
};

const repository = new HackerNewsRepository();
const renderer = new NewsRenderer('#news-container');
const loadMoreButton = new LoadMoreButton('#load-more-btn');

new ThemeManager('#theme-toggle');
new BackToTop('#back-to-top');

new SearchBar('#search-input', (query) => {
  state.searchQuery = query;
  if (state.loadedStories.length === 0) return;
  if (String(query).trim() === '') {
    renderer.renderFiltered(state.loadedStories);
  } else {
    renderer.renderFiltered(filterStories(state.loadedStories, query));
  }
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

    if (String(state.searchQuery).trim() !== '') {
      renderer.renderFiltered(filterStories(state.loadedStories, state.searchQuery));
    } else {
      renderer.render(stories);
    }

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

async function init() {
  renderer.showLoading();

  try {
    state.allIds = await repository.getNewStoryIds();
    renderer.hideLoading();

    if (state.allIds.length === 0) {
      renderer.showError('Nessuna news disponibile al momento.');
      return;
    }

    await loadPage();
    loadMoreButton.bindClick(loadPage);
    loadMoreButton.show();
  } catch (error) {
    renderer.hideLoading();
    renderer.showError('Impossibile caricare le news. Controlla la connessione.');
    console.error('Init error:', error);
  }
}

init();
