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

const quoteForm = document.querySelector('[data-quote-form]');
if (quoteForm instanceof HTMLFormElement) {
  let quoteStep = 1;
  const panels = [...quoteForm.querySelectorAll('[data-quote-step]')];
  const progress = [...quoteForm.querySelectorAll('[data-quote-progress]')];
  const showQuoteStep = (nextStep) => {
    quoteStep = Math.max(1, Math.min(3, nextStep));
    panels.forEach((panel) => { panel.hidden = Number(panel.dataset.quoteStep) !== quoteStep; });
    progress.forEach((item) => {
      const number = Number(item.dataset.quoteProgress);
      item.classList.toggle('is-active', number === quoteStep);
      item.classList.toggle('is-complete', number < quoteStep);
    });
  };
  const validateStep = () => {
    const panel = quoteForm.querySelector(`[data-quote-step="${quoteStep}"]`);
    const fields = panel ? [...panel.querySelectorAll('input[required], select[required], textarea[required]')] : [];
    const invalid = fields.find((field) => !field.checkValidity());
    if (invalid) { invalid.reportValidity(); invalid.focus(); return false; }
    return true;
  };
  quoteForm.querySelectorAll('[data-quote-next]').forEach((button) => button.addEventListener('click', () => {
    if (!validateStep()) return;
    showQuoteStep(quoteStep + 1);
    if (quoteStep === 3) {
      const value = (name) => quoteForm.elements.namedItem(name)?.value || 'Not specified';
      const review = quoteForm.querySelector('[data-quote-review]');
      if (review) review.innerHTML = `<div><b>Project</b><span>${value('project_type')} / ${value('material')}</span></div><div><b>Application</b><span>${value('application')} / ${value('quantity')}</span></div><div><b>Contact</b><span>${value('name')} / ${value('company')}<br>${value('email')} / ${value('phone')}</span></div>`;
    }
  }));
  quoteForm.querySelectorAll('[data-quote-back]').forEach((button) => button.addEventListener('click', () => showQuoteStep(quoteStep - 1)));
}
