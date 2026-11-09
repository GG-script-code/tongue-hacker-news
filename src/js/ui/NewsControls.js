export class NewsControls {
  constructor({ sortSelector, onChange }) {
    this.sortSelector = document.querySelector(sortSelector);
    this.onChange = onChange;

    if (!this.sortSelector) {
      throw new Error('NewsControls: missing sort selector');
    }

    this.bind();
  }

  bind() {
    this.sortSelector.addEventListener('change', () => this.emitChange());
  }

  emitChange() {
    this.onChange({
      sortCriterion: this.sortSelector.value,
    });
  }
}
