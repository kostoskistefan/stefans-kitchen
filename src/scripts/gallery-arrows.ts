function initializeGalleries(): void {
  for (const gallery of document.querySelectorAll<HTMLElement>('[data-gallery]')) {
    const track = gallery.querySelector<HTMLElement>('[data-gallery-track]');
    if (track === null) {
      continue;
    }

    const updateOverflowState = (): void => {
      gallery.dataset.overflowing = String(track.scrollWidth > track.clientWidth + 1);
    };
    const scrollTrack = (direction: number): void => {
      track.scrollBy({ left: direction * track.clientWidth * 0.7, behavior: 'smooth' });
    };

    gallery.querySelector('[data-gallery-previous]')?.addEventListener('click', () => scrollTrack(-1));
    gallery.querySelector('[data-gallery-next]')?.addEventListener('click', () => scrollTrack(1));
    new ResizeObserver(updateOverflowState).observe(track);
    window.addEventListener('load', updateOverflowState);
    updateOverflowState();
  }
}

initializeGalleries();
