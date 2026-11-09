import { formatDate } from '@/js/utils/dateFormatter.js';

export class NewsRenderer {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      throw new Error(`Container not found: ${containerSelector}`);
    }
  }

  clear() {
    this.container.innerHTML = '';
  }

  render(stories) {
    if (!Array.isArray(stories) || stories.length === 0) return;

    const html = stories
      .map(
        (story) => `
        <article class="news-card">
          <h2 class="news-title">
            <a href="${story.url}" target="_blank" rel="noopener noreferrer">
              ${story.title}
            </a>
          </h2>
          <p class="news-date">${formatDate(story.time)}</p>
        </article>
      `
      )
      .join('');

    this.container.insertAdjacentHTML('beforeend', html);
  }

  showLoading() {
    this.container.insertAdjacentHTML(
      'beforeend',
      '<p class="loading-message">Caricamento in corso...</p>'
    );
  }

  hideLoading() {
    const loading = this.container.querySelector('.loading-message');
    if (loading) loading.remove();
  }

  showError(message) {
    this.hideLoading();
    this.container.insertAdjacentHTML('beforeend', `<div class="error-message">${message}</div>`);
  }

  clearError() {
    const error = this.container.querySelector('.error-message');
    if (error) error.remove();
  }
}
