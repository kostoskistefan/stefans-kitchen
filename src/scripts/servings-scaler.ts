import { formatQuantity } from '../lib/formatQuantity';

function initializeServingsScaler(): void {
  const servingsControl = document.querySelector<HTMLElement>('[data-base-servings]');
  const servingsInput = document.querySelector<HTMLInputElement>('[data-servings-input]');
  if (servingsControl === null || servingsInput === null) {
    return;
  }

  const baseServings = Number(servingsControl.dataset.baseServings);
  const amountElements = document.querySelectorAll<HTMLElement>('[data-base-quantity]');

  const fitInputWidth = (): void => {
    servingsInput.style.width = `${Math.max(servingsInput.value.length, 1)}ch`;
  };

  const renderAmounts = (): void => {
    fitInputWidth();
    const targetServings = Number(servingsInput.value);
    if (Number.isFinite(targetServings) === false || targetServings <= 0) {
      return;
    }
    for (const amountElement of amountElements) {
      const scaledQuantity = (Number(amountElement.dataset.baseQuantity) * targetServings) / baseServings;
      amountElement.textContent = `${formatQuantity(scaledQuantity)} ${amountElement.dataset.unit ?? ''}`.trim();
    }
  };

  const changeServingsBy = (difference: number): void => {
    servingsInput.value = String(Math.max(1, Number(servingsInput.value) + difference));
    renderAmounts();
  };

  servingsInput.addEventListener('input', renderAmounts);
  document.querySelector('[data-servings-decrease]')?.addEventListener('click', () => changeServingsBy(-1));
  document.querySelector('[data-servings-increase]')?.addEventListener('click', () => changeServingsBy(1));
}

initializeServingsScaler();
