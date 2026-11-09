import { HackerNewsRepository } from '@/js/api/HackerNewsRepository.js';
import { NewsRenderer } from '@/js/ui/NewsRenderer.js';
import { LoadMoreButton } from '@/js/ui/LoadMoreButton.js';
import { getNextBatch } from '@/js/utils/pagination.js';
import { config } from '@/js/config.js';

const state = {
  allIds: [],
  page: 0,
  isLoading: false,
  exhausted: false,
};

const repository = new HackerNewsRepository();
const renderer = new NewsRenderer('#news-container');
const loadMoreButton = new LoadMoreButton('#load-more-btn');

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
    renderer.render(stories);

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
