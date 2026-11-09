const toggleButton = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');

function renderToggleLabel(): void {
  const isDark = document.documentElement.dataset.theme === 'dark';
  toggleButton?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

toggleButton?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem('theme', nextTheme);
  renderToggleLabel();
});

renderToggleLabel();
