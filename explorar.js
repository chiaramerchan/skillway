const shortProfiles = [
  'Si te gusta la naturaleza y el trabajo al aire libre. Podés empezar sin experiencia en tareas de apoyo.',
  'Si disfrutás cultivar y trabajar en equipo. No necesitás experiencia para comenzar.',
  'Si tenés paciencia y te gusta enseñar. Se valora formación docente o experiencia con infancias.',
  'Si te gustan los oficios y el trabajo en equipo. Las tareas técnicas requieren experiencia.',
  'Veterinarios y estudiantes para apoyo clínico supervisado. También podés sumar en cuidados y adopciones.',
  'Si te interesa cuidar los bosques. Podés colaborar sin experiencia previa.',
  'Si te gusta el arte y compartir tu creatividad. También hay tareas de apoyo.',
  'Si manejás herramientas digitales y tenés paciencia para enseñar. No necesitás un título.',
  'Si te gusta cocinar y ayudar en equipo. La capacitación depende de la tarea.',
  'Si tenés empatía y disfrutás escuchar y acompañar. No necesitás experiencia clínica.',
"Si te gusta cultivar y aprender en comunidad. No necesitás experiencia para las tareas básicas.",
"Si te gusta cuidar animales. Para atención clínica se requiere formación veterinaria.",
"Si disfrutás crear y trabajar con otras personas. Se valora experiencia en talleres.",
"Si te interesa el ambiente y trabajar al aire libre. Podés empezar sin experiencia.",
"Si te gusta enseñar y acompañar aprendizajes. Se valora formación o experiencia educativa."
];
const metadata = [
  { categories: ['ambiente', 'animales'], duration: 'short', label: '1–2 semanas' },
  { categories: ['ambiente', 'agricultura'], duration: 'medium', label: '1–3 meses' },
  { categories: ['educacion'], duration: 'medium', label: '1–3 meses' },
  { categories: ['construccion'], duration: 'short', label: '1–2 semanas' },
  { categories: ['animales', 'salud'], duration: 'long', label: 'Más de 3 meses' },
  { categories: ['ambiente'], duration: 'short', label: '1–2 semanas' },
  { categories: ['arte', 'educacion'], duration: 'medium', label: '1–3 meses' },
  { categories: ['educacion'], duration: 'medium', label: '1–3 meses' },
  { categories: ['salud'], duration: 'short', label: '1–2 semanas' },
  { categories: ['salud'], duration: 'long', label: 'Más de 3 meses' },
{"categories": ["agricultura"], "duration": "medium", "label": "1–3 meses"},
{"categories": ["animales"], "duration": "short", "label": "1–2 semanas"},
{"categories": ["arte"], "duration": "medium", "label": "1–3 meses"},
{"categories": ["ambiente"], "duration": "short", "label": "1–2 semanas"},
{"categories": ["educacion"], "duration": "medium", "label": "1–3 meses"}
];
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.1 4.7a5.4 5.4 0 0 0-7.6 0l-.5.5-.5-.5a5.4 5.4 0 0 0-7.6 7.6L12 20.4l8.1-8.1a5.4 5.4 0 0 0 0-7.6Z"/></svg>';
const savedItems = skillwaySaved.read('opportunities');
function card(index, layout = '') {
  const item = opportunities[index];
  return `<article class="explore-card ${layout}"><div class="explore-card-photo${item.image ? '' : ' pending-photo'}">${item.image ? `<img src="${item.image}" alt="${item.imageAlt}" loading="lazy">` : `<span>Foto próximamente</span>`}</div><button class="explore-save" data-save="${index}" aria-label="${savedItems.has(index) ? 'Quitar de guardados' : 'Guardar'} ${item.title}" aria-pressed="${savedItems.has(index)}">${heart}</button><div class="explore-card-body"><h3><button data-detail="${index}">${item.title}</button></h3><p class="explore-place">${item.country}</p><div class="opportunity-pills"><span>${({agricultura: 'Agricultura', ambiente: 'Naturaleza', animales: 'Cuidado animal', educacion: 'Educación', construccion: 'Construcción', arte: 'Arte', salud: 'Comunidad'})[metadata[index].categories.includes('agricultura') ? 'agricultura' : metadata[index].categories[0]]}</span><span>${metadata[index].label}</span></div></div></article>`;
}
const sheet = document.querySelector('.filters-sheet');
const filterForm = document.querySelector('#explore-filters');
const searchForm = document.querySelector('.search-bar');
let applied = { categories: [], location: '', duration: '' };
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function renderResults() {
  const query = normalize(searchForm.elements.buscar.value.trim());
  const matches = opportunities.map((item, index) => index).filter(index => {
    const item = opportunities[index], meta = metadata[index];
    return (!query || normalize([item.title, item.country, item.description, ...item.tags].join(' ')).includes(query))
      && (!applied.categories.length || applied.categories.some(category => meta.categories.includes(category)))
      && (!applied.location || item.country === applied.location)
      && (!applied.duration || meta.duration === applied.duration);
  });
  document.querySelectorAll('.explore-category').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category ? applied.categories.includes(button.dataset.category) : !applied.categories.length)));
  document.querySelector('#results-count').textContent = `${matches.length} ${matches.length === 1 ? 'experiencia encontrada' : 'experiencias encontradas'}`;
  document.querySelector('#result-list').innerHTML = matches.map(index => card(index, 'horizontal')).join('');
  document.querySelector('.empty-results').hidden = matches.length > 0;
  document.querySelector('.filter-button').classList.toggle('filters-active', !!(applied.categories.length || applied.location || applied.duration));
}
function clearFilters() {
  filterForm.reset();
  applied = { categories: [], location: '', duration: '' };
  document.querySelectorAll('.explore-category').forEach(button => button.setAttribute('aria-pressed', 'false'));
}
document.querySelector('.filter-button').addEventListener('click', () => sheet.showModal());
document.querySelector('.close-filters').addEventListener('click', () => sheet.close());
filterForm.addEventListener('submit', event => {
  event.preventDefault();
  const values = new FormData(filterForm);
  applied = { categories: values.getAll('category'), location: values.get('location'), duration: values.get('duration') };
  renderResults();
  sheet.close();
});
document.querySelector('.clear-filters').addEventListener('click', () => { clearFilters(); renderResults(); sheet.close(); });
searchForm.addEventListener('submit', event => { event.preventDefault(); renderResults(); });
searchForm.elements.buscar.addEventListener('search', renderResults);
document.querySelectorAll('.explore-category').forEach(button => button.addEventListener('click', () => {
  clearFilters();
  applied.categories = button.dataset.category ? [button.dataset.category] : [];
  if (button.dataset.category) filterForm.querySelector(`[value="${button.dataset.category}"]`).checked = true;
  button.setAttribute('aria-pressed', 'true');
  renderResults();
}));
document.querySelectorAll('.reset-results').forEach(button => button.addEventListener('click', () => { clearFilters(); searchForm.reset(); renderResults(); }));
document.addEventListener('click', event => {
  const button = event.target.closest('[data-save]');
  if (!button) return;
  const index = Number(button.dataset.save);
  savedItems.has(index) ? savedItems.delete(index) : savedItems.add(index);
  skillwaySaved.write('opportunities', savedItems);
  document.querySelectorAll(`[data-save="${index}"]`).forEach(item => {
    item.setAttribute('aria-pressed', String(savedItems.has(index)));
    item.setAttribute('aria-label', `${savedItems.has(index) ? 'Quitar de guardados' : 'Guardar'} ${opportunities[index].title}`);
  });
});
      const detail = document.querySelector('.opportunity-dialog');
      document.addEventListener('click', event => {
        const button = event.target.closest('[data-detail]');
        if (!button) return;
        const item = opportunities[Number(button.dataset.detail)];
        document.querySelector('#fact-duration').textContent = metadata[Number(button.dataset.detail)].label;
        detail.dataset.index = button.dataset.detail;
        document.querySelector('.save-detail').setAttribute('aria-pressed', String(savedItems.has(Number(button.dataset.detail))));
        document.querySelector('.save-detail').setAttribute('aria-label', savedItems.has(Number(button.dataset.detail)) ? 'Quitar de guardados' : 'Guardar voluntariado');
        document.querySelector('.share-feedback').textContent = '';
        document.querySelector('#detail-title').textContent = item.title;
        document.querySelector('.detail-location').textContent = item.country;
        document.querySelector('.detail-summary').textContent = item.description;
        document.querySelector('.detail-profile-summary').textContent = shortProfiles[Number(button.dataset.detail)];
        document.querySelectorAll('.detail-more').forEach(section => section.open = false);
        document.querySelector('.detail-contribution').textContent = item.contribution;
        document.querySelector('.detail-profile').textContent = item.profile;
        const skillsList = document.querySelector('.detail-skills');
        skillsList.replaceChildren(...item.skills.map(skill => {
          const entry = document.createElement('li');
          entry.textContent = skill;
          return entry;
        }));
        document.querySelector('.detail-experience').textContent = item.experience;
        document.querySelector('.detail-tags').innerHTML = item.tags.map(tag => `<span>${tag}</span>`).join('');
        const detailImage = document.querySelector('.detail-image');
        detailImage.classList.toggle('image-placeholder', !item.image);
        detailImage.classList.toggle('has-photo', Boolean(item.image));
        detailImage.innerHTML = item.image ? `<img class="opportunity-photo" src="${item.image}" alt="${item.imageAlt}" />` : '';
        if (item.image) {
          detailImage.removeAttribute('role');
          detailImage.removeAttribute('aria-label');
        } else {
          detailImage.setAttribute('role', 'img');
          detailImage.setAttribute('aria-label', 'Foto del voluntariado pendiente');
        }
        document.querySelector('.contact-panel').hidden = true;
        document.querySelector('.opportunity-contact-form').reset();
        document.querySelector('.contact-feedback').textContent = '';
        detail.showModal();
        detail.scrollTop = 0;
      });
      let contactAction = 'apply';
      document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
        contactAction = button.dataset.action;
        const applying = contactAction === 'apply';
        const panel = document.querySelector('.contact-panel');
        panel.hidden = false;
        document.querySelector('#contact-title').textContent = applying ? 'Anotate a esta experiencia' : 'Contactá a la organización';
        document.querySelector('.contact-context').textContent = document.querySelector('#detail-title').textContent;
        document.querySelector('#contact-message').value = applying ? '¡Hola! Me gustaría participar en este voluntariado. Les cuento sobre mi experiencia y disponibilidad: ' : '';
        document.querySelector('.contact-submit').textContent = applying ? 'Probar inscripción' : 'Probar envío de mensaje';
        document.querySelector('.contact-feedback').textContent = '';
        document.querySelector('#contact-name').focus();
      }));
      document.querySelector('.opportunity-contact-form').addEventListener('submit', event => {
        event.preventDefault();
        document.querySelector('.contact-feedback').textContent = contactAction === 'apply'
          ? 'La inscripción está lista en esta demo. Todavía no fue enviada a la organización.'
          : 'Tu mensaje está listo en esta demo. Todavía no fue enviado a la organización.';
      });
      document.querySelector('.close-detail').addEventListener('click', () => detail.close());

// La búsqueda y los destinos de Inicio abren los resultados correspondientes.
const homeParams = new URLSearchParams(window.location.search);
const destination = homeParams.get('destino');
const homeQuery = homeParams.get('q');
if (destination && [...filterForm.elements.location.options].some(option => option.value === destination)) {
  applied.location = destination;
  filterForm.elements.location.value = destination;
}
if (homeQuery) searchForm.elements.buscar.value = homeQuery;
renderResults();

document.querySelector('.more-categories').addEventListener('click', () => sheet.showModal());

document.querySelector('.save-detail').addEventListener('click', () => {
  const index = Number(detail.dataset.index);
  const button = document.querySelector(`[data-save="${index}"]`);
  if (button) button.click();
  const saved = savedItems.has(index);
  document.querySelector('.save-detail').setAttribute('aria-pressed', String(saved));
  document.querySelector('.save-detail').setAttribute('aria-label', saved ? 'Quitar de guardados' : 'Guardar voluntariado');
});
document.querySelector('.share-detail').addEventListener('click', async () => {
  const item = opportunities[Number(detail.dataset.index)];
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('experiencia', detail.dataset.index);
  const feedback = document.querySelector('.share-feedback');
  try {
    if (navigator.share && url.protocol.startsWith('http')) {
      await navigator.share({ title: item.title, text: item.description, url: url.href });
    } else if (navigator.clipboard && url.protocol.startsWith('http')) {
      await navigator.clipboard.writeText(url.href);
      feedback.textContent = 'Enlace copiado para compartir.';
    } else {
      feedback.textContent = 'Para compartir un enlace, abrí la app desde su sitio web.';
    }
  } catch (error) {
    if (error.name !== 'AbortError') feedback.textContent = 'No se pudo compartir. Probá nuevamente.';
  }
});
const sharedIndex = homeParams.get('experiencia');
if (sharedIndex !== null && /^\d+$/.test(sharedIndex) && Number(sharedIndex) < opportunities.length) {
  const button = document.querySelector(`[data-detail="${Number(sharedIndex)}"]`);
  if (button) button.click();
}
