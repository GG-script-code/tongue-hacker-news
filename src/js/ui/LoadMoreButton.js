export class LoadMoreButton {
  constructor(selector) {
    this.button = document.querySelector(selector);
    if (!this.button) {
      throw new Error(`Button not found: ${selector}`);
    }
  }

  bindClick(callback) {
    this.button.addEventListener('click', callback);
  }

  disable() {
    this.button.disabled = true;
  }

  enable() {
    this.button.disabled = false;
  }

  hide() {
    this.button.style.display = 'none';
  }

  show() {
    this.button.style.display = 'inline-block';
  }
}
