const toggle = document.querySelector('.site-menu-toggle');
const navigation = document.querySelector('.mobile-navigation');

if (toggle && navigation) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    navigation.classList.toggle('is-open', !open);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      toggle.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    }
  });
}

const cards = [...document.querySelectorAll('[data-material-card]')];
let activeMaterial = Math.max(0, cards.findIndex((card) => card.classList.contains('is-active')));
const selectMaterial = (index) => {
  if (!cards.length) return;
  activeMaterial = (index + cards.length) % cards.length;
  cards.forEach((card, cardIndex) => {
    const active = cardIndex === activeMaterial;
    card.classList.toggle('is-active', active);
    card.querySelector('.oubei-material-trigger')?.setAttribute('aria-expanded', String(active));
  });
  cards[activeMaterial]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
};
cards.forEach((card, index) => card.querySelector('.oubei-material-trigger')?.addEventListener('click', () => selectMaterial(index)));
document.querySelector('[data-material-prev]')?.addEventListener('click', () => selectMaterial(activeMaterial - 1));
document.querySelector('[data-material-next]')?.addEventListener('click', () => selectMaterial(activeMaterial + 1));

const filterToggle = document.querySelector('[data-filter-toggle]');
const filterPanel = document.querySelector('#catalog-filters');
filterToggle?.addEventListener('click', () => {
  const open = filterPanel?.classList.toggle('is-open') ?? false;
  filterToggle.setAttribute('aria-expanded', String(open));
});
