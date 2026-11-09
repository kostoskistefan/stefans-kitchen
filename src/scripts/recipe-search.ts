const searchInput = document.querySelector<HTMLInputElement>('[data-recipe-search]');
const recipeCards = document.querySelectorAll<HTMLElement>('[data-recipe-card]');
const emptyMessage = document.querySelector<HTMLElement>('[data-empty-message]');

searchInput?.addEventListener('input', () => {
  const searchTerms = searchInput.value.toLowerCase().split(' ').filter((term) => term.length > 0);
  let visibleCount = 0;

  for (const recipeCard of recipeCards) {
    const searchText = recipeCard.dataset.searchText ?? '';
    const matchesEveryTerm = searchTerms.every((term) => searchText.includes(term));
    recipeCard.hidden = matchesEveryTerm === false;
    if (matchesEveryTerm === true) {
      visibleCount += 1;
    }
  }

  if (emptyMessage instanceof HTMLElement) {
    emptyMessage.hidden = visibleCount > 0;
  }
});
