export class SearchBar {
  constructor(selector, onSearch) {
    this.input = document.querySelector(selector);
    if (!this.input) {
      throw new Error(`Search input not found: ${selector}`);
    }
    this.onSearch = onSearch;
    this.input.addEventListener('input', (e) => this.onSearch(e.target.value));
  }
}
