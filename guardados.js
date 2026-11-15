let activeType = 'opportunities';
const panel = document.querySelector('#saved-content');
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.1 4.7a5.4 5.4 0 0 0-7.6 0l-.5.5-.5-.5a5.4 5.4 0 0 0-7.6 7.6L12 20.4l8.1-8.1a5.4 5.4 0 0 0 0-7.6Z"/></svg>';
function renderSaved() {
  const saved = skillwaySaved.read(activeType);
  const entries = activeType === 'opportunities'
    ? opportunities.map((item, index) => ({ ...item, key: index, url: `explorar.html?experiencia=${index}`, subtitle: item.country })).filter(item => saved.has(item.key))
    : destinations.filter(item => saved.has(item.country)).map(item => ({ title: item.country, key: item.country, image: item.image, imageAlt: `Experiencias en ${item.country}`, subtitle: item.image ? 'Descubrí experiencias en este destino' : 'Nuevas experiencias próximamente', url: `explorar.html?destino=${encodeURIComponent(item.country)}` }));
  if (!entries.length) {
    panel.innerHTML = `<div class="saved-empty"><div class="empty-heart">${heart}</div><span class="saved-eyebrow">TU PRÓXIMA AVENTURA EMPIEZA ACÁ</span><h2>${activeType === 'opportunities' ? 'Guardá hoy, viajá mañana' : '¿A dónde te gustaría ir?'}</h2><p>${activeType === 'opportunities' ? 'Tocá el corazón de las experiencias que te entusiasmen. Las vas a encontrar acá cuando llegue el momento de armar tu próximo viaje.' : 'Guardá los destinos que soñás conocer y empezá a imaginar tu próximo camino.'}</p><a href="${activeType === 'opportunities' ? 'explorar.html' : 'index.html'}">${activeType === 'opportunities' ? 'Explorar oportunidades' : 'Descubrir destinos'} <span aria-hidden="true">→</span></a><small>Un lugar, una causa, un nuevo comienzo.</small></div>`;
    return;
  }
  panel.innerHTML = '<div class="saved-list">'+entries.map(item => `<article class="saved-card"><a href="${item.url}">${item.image ? `<img src="${item.image}" alt="${item.imageAlt}">` : `<span class="saved-photo-pending" aria-hidden="true">↗</span>`}<div><h2>${item.title}</h2><p>${item.subtitle}</p><span>Ver ${activeType === 'opportunities' ? 'experiencia' : 'destino'} →</span></div></a><button class="remove-saved" data-key="${item.key}" aria-label="Quitar de guardados: ${item.title}">${heart}</button></article>`).join('')+'</div>';
}
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  activeType = tab.dataset.type;
  tabs.forEach(button => { button.setAttribute('aria-selected', String(button === tab)); button.tabIndex = button === tab ? 0 : -1; });
  panel.setAttribute('aria-labelledby', tab.id);
  renderSaved();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = tabs[event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index];
    selectTab(next); next.focus();
  });
});
panel.addEventListener('click', event => {
  const button = event.target.closest('[data-key]');
  if (!button) return;
  const saved = skillwaySaved.read(activeType);
  saved.delete(activeType === 'opportunities' ? Number(button.dataset.key) : button.dataset.key);
  skillwaySaved.write(activeType, saved); renderSaved();
});
window.addEventListener('storage', renderSaved);
renderSaved();
