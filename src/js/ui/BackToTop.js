export class BackToTop {
  constructor(selector, scrollThreshold = 300) {
    this.button = document.querySelector(selector);
    if (!this.button) {
      throw new Error(`Back-to-top button not found: ${selector}`);
    }
    this.scrollThreshold = scrollThreshold;
    this.bind();
  }

  bind() {
    window.addEventListener('scroll', () => this.updateVisibility(), { passive: true });
    this.button.addEventListener('click', () => this.scrollToTop());
  }

  updateVisibility() {
    const shouldShow = window.scrollY > this.scrollThreshold;
    this.button.style.display = shouldShow ? 'flex' : 'none';
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
