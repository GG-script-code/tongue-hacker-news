const STORAGE_KEY = 'tongue:theme';
const DARK_CLASS = 'dark';

export class ThemeManager {
  constructor(toggleButtonSelector) {
    this.button = document.querySelector(toggleButtonSelector);
    if (!this.button) {
      throw new Error(`Toggle button not found: ${toggleButtonSelector}`);
    }
    this.init();
  }

  init() {
    const saved = this.getSavedTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    this.apply(initial);
    this.button.addEventListener('click', () => this.toggle());
  }

  toggle() {
    const next = this.isDark() ? 'light' : 'dark';
    this.apply(next);
    this.save(next);
  }

  apply(theme) {
    document.body.classList.toggle(DARK_CLASS, theme === 'dark');
    this.button.textContent = theme === 'dark' ? '☀' : '☾';
    this.button.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Attiva tema chiaro' : 'Attiva tema scuro'
    );
  }

  isDark() {
    return document.body.classList.contains(DARK_CLASS);
  }

  getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  save(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Silently ignore storage errors (e.g. private mode)
    }
  }
}
