import { formatDate } from '@/js/utils/dateFormatter.js';

const SKELETON_COUNT = 3;

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

  renderStories(stories, groups) {
    this.container.innerHTML = '';

    if (!Array.isArray(stories) || stories.length === 0) {
      this.container.insertAdjacentHTML(
        'beforeend',
        '<p class="no-results">Nessuna news corrisponde ai filtri selezionati.</p>'
      );
      return;
    }

    if (Array.isArray(groups) && groups.length > 0) {
      const html = groups
        .map(
          (group) => `
          <section class="news-group">
            <h2 class="news-group-label">${group.label}</h2>
            ${this.buildCardsHtml(group.stories)}
          </section>
        `
        )
        .join('');
      this.container.insertAdjacentHTML('beforeend', html);
      return;
    }

    this.container.insertAdjacentHTML('beforeend', this.buildCardsHtml(stories));
  }

  buildCardsHtml(stories) {
    return stories
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
  }

  showLoading() {
    const skeletons = Array.from({ length: SKELETON_COUNT })
      .map(
        () => `
        <div class="skeleton-card">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line date"></div>
        </div>
      `
      )
      .join('');

    this.container.insertAdjacentHTML(
      'beforeend',
      `<div class="skeleton-group">${skeletons}</div>`
    );
  }

  hideLoading() {
    const loading = this.container.querySelector('.skeleton-group');
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
