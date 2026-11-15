const icons = {
 heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.1 4.7a5.4 5.4 0 0 0-7.6 0l-.5.5-.5-.5a5.4 5.4 0 0 0-7.6 7.6L12 20.4l8.1-8.1a5.4 5.4 0 0 0 0-7.6Z"/></svg>',
 comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11a9 9 0 0 1-9 9H4l1-5a9 9 0 1 1 16-4Z"/></svg>',
 share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 3 7 6-7 6V11C7 11 5 15 3 20c0-10 4-13 11-13V3Z"/></svg>'
};
const samplePosts = [
 { id: 'mica', image: 'assets/mica 1.jpeg', avatar: 'assets/mica 2.jpeg', name: 'Mica', time: 'Hace 2 días', place: 'Vida en la granja', text: 'Hoy fue un día increíble en la granja 🌱 Aprendiendo siempre.', likes: 124, comments: [{ name: 'Sofi', text: '¡Qué linda experiencia! Me encantaría sumarme.' }] },
 { id: 'tomas', image: 'assets/tomas 1.jpeg', avatar: 'assets/tomas 2.jpeg', name: 'Tomás', time: 'Hace 3 días', place: 'Cuidado del océano', text: 'Ver una tortuga volver al mar te cambia la forma de mirar el mundo. Qué suerte poder ser parte 🐢', likes: 87, comments: [] },
 { id: 'sofi', image: 'assets/sofi 1.jpeg', avatar: 'assets/sofi 2.jpeg', name: 'Sofi', time: 'Hace 4 días', place: 'Aprender en comunidad', text: 'Hoy compartimos una tarde de lectura y juegos. Me llevo más aprendizajes de los que traje 📚', likes: 96, comments: [] },
 { id: 'lucas', image: 'assets/lucas 1.jpeg', avatar: 'assets/lucas 2.jpeg', name: 'Lucas', time: 'Hace 5 días', place: 'Huerta comunitaria', text: 'Nuestra primera cosecha juntos. Nada como ver crecer algo que cuidamos entre todos 🥬', likes: 63, comments: [] },
 { id: 'vale', image: 'assets/vale 1.jpeg', avatar: 'assets/vale 2.jpeg', name: 'Vale', time: 'Hace 6 días', place: 'Rescate animal', text: 'Una semana acompañando al refugio y ya siento que encontré mi lugar. Cada pequeño cuidado cuenta 🐾', likes: 112, comments: [] },
 { id: 'nico', image: 'assets/nico 1.jpeg', avatar: 'assets/nico 2.jpeg', name: 'Nico', time: 'Hace una semana', place: 'Construir en equipo', text: 'Terminamos de pintar el espacio comunitario. Muchas manos, nuevas amistades y un montón de historias para contar ✨', likes: 74, comments: [] }
];
function readLocal(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
function writeLocal(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
const personalPosts = readLocal('skillway-community-posts', []);
// Retirar una sola vez la publicación accidental solicitada por la usuaria.
if (!readLocal('skillway-remove-accidental-chiara-v1', false)) {
  const accidentalIndex = personalPosts.findIndex(post => post.name === 'Chiara');
  if (accidentalIndex !== -1) {
    personalPosts.splice(accidentalIndex, 1);
    writeLocal('skillway-community-posts', personalPosts);
  }
  writeLocal('skillway-remove-accidental-chiara-v1', true);
}

const liked = new Set(readLocal('skillway-community-likes', []));
const feed = document.querySelector('#community-feed');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function renderFeed() {
 feed.innerHTML = [...personalPosts, ...samplePosts].map((post, index) => `<article class="community-post" data-post="${escapeHtml(post.id)}"><header><span class="post-avatar avatar-${index % 4}" aria-label="Avatar de ${escapeHtml(post.name)}">${post.avatar ? `<img src="${post.avatar}" alt="" loading="lazy">` : escapeHtml(post.name[0])}</span><div><h2>${escapeHtml(post.name)}</h2><time>${escapeHtml(post.time)}</time></div><button class="post-more" aria-label="Opciones de la publicación de ${escapeHtml(post.name)}" aria-expanded="false">•••</button></header><div class="post-options" hidden><button class="copy-post">Copiar texto</button></div>${post.image ? `<div class="post-photo has-community-photo"><img src="${post.image}" alt="${escapeHtml(post.place)} — publicación de ${escapeHtml(post.name)}" loading="lazy"></div>` : `<div class="post-photo pending-${index % 3}" role="img" aria-label="Foto de ${escapeHtml(post.place)}, pendiente"><svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="10" width="34" height="28" rx="5"/><circle cx="17" cy="19" r="3"/><path d="m8 33 11-10 8 7 6-5 8 8"/></svg><span>${escapeHtml(post.place)}</span><small>Foto próximamente</small></div>`}<p class="post-caption">${escapeHtml(post.text)}</p><div class="post-actions"><button class="post-like" aria-label="Me gusta" aria-pressed="${liked.has(post.id)}">${icons.heart}<span>${post.likes + (liked.has(post.id) ? 1 : 0)}</span></button><button class="post-comment" aria-expanded="false" aria-label="Ver comentarios">${icons.comment}<span>${post.comments.length}</span></button><button class="post-share" aria-label="Compartir publicación">${icons.share}</button><button class="post-private" aria-label="Enviar mensaje privado a ${escapeHtml(post.name)}" title="Mensaje privado"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3Z"/><path d="m3 5 9 7 9-7"/></svg></button><button class="post-invite" aria-label="Invitar a ${escapeHtml(post.name)} a un grupo" title="Invitar a un grupo"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M19 13v8m-4-4h8"/></svg></button></div><section class="post-comments" hidden aria-label="Comentarios"><div class="comment-list">${post.comments.map(comment => `<p><strong>${escapeHtml(comment.name)}</strong> ${escapeHtml(comment.text)}</p>`).join('') || '<p class="no-comments">Sé la primera persona en comentar.</p>'}</div><form class="comment-form"><label class="sr-only" for="comment-${escapeHtml(post.id)}">Tu comentario</label><input id="comment-${escapeHtml(post.id)}" name="comment" required maxlength="500" placeholder="Escribí un comentario…"><button>Comentar</button></form><small>Comentarios de esta demo.</small></section><p class="post-feedback" role="status"></p></article>`).join('');
}
renderFeed();
feed.addEventListener('click', async event => {
 const button = event.target.closest('button'); if (!button) return;
 const article = button.closest('[data-post]'); if (!article) return;
 const post = [...personalPosts, ...samplePosts].find(post => post.id === article.dataset.post);
 if (button.matches('.post-private, .post-invite')) {
   openCommunityContact(post, button.matches('.post-invite') ? 'invite' : 'private');
 }
 if (button.matches('.post-like')) {
   liked.has(post.id) ? liked.delete(post.id) : liked.add(post.id);
   writeLocal('skillway-community-likes', [...liked]);
   button.setAttribute('aria-pressed', String(liked.has(post.id)));
   button.querySelector('span').textContent = post.likes + (liked.has(post.id) ? 1 : 0);
 }
 if (button.matches('.post-comment, .post-more')) {
   const section = article.querySelector(button.matches('.post-comment') ? '.post-comments' : '.post-options');
   section.hidden = !section.hidden; button.setAttribute('aria-expanded', String(!section.hidden));
 }
 if (button.matches('.post-share, .copy-post')) {
   const feedback = article.querySelector('.post-feedback');
   try {
     if (button.matches('.post-share') && navigator.share) await navigator.share({ title: 'Comunidad Skillway', text: `${post.name}: ${post.text}` });
     else if (navigator.clipboard) { await navigator.clipboard.writeText(post.text); feedback.textContent = 'Texto copiado.'; }
     else feedback.textContent = 'Compartir estará disponible al abrir la app desde su sitio web.';
   } catch (error) { if (error.name !== 'AbortError') feedback.textContent = 'No se pudo compartir. Probá nuevamente.'; }
 }
});
feed.addEventListener('submit', event => {
 event.preventDefault(); const form = event.target; const text = form.elements.comment.value.trim(); if (!text) return;
 const article = form.closest('[data-post]'); const post = [...personalPosts, ...samplePosts].find(post => post.id === article.dataset.post);
 post.comments.push({name: 'Chiara', text});
 const entry = document.createElement('p'); const name = document.createElement('strong'); name.textContent = 'Chiara '; entry.append(name, document.createTextNode(text));
 article.querySelector('.no-comments')?.remove(); article.querySelector('.comment-list').append(entry);
 article.querySelector('.post-comment span').textContent = post.comments.length; form.reset();
});
const challengeIcons = {
 nature: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27V11m-8 16h16M16 19C7 20 5 14 6 10c7-1 11 3 10 9Zm0-6c8 0 11-6 10-10-7 0-11 4-10 10Z"/></svg>',
 skill: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="9" cy="8" r="4"/><circle cx="23" cy="8" r="4"/><path d="M4 27c1-7 4-11 9-12m15 12c-1-7-4-11-9-12m-7 5 4-4 4 4m-4-4v11"/></svg>',
 world: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/><path d="M3 16h26M16 3c-8 7-8 19 0 26 8-7 8-19 0-26ZM6 8c7 4 13 4 20 0M6 24c7-4 13-4 20 0"/></svg>',
 community: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="5"/><path d="M6 29v-3a10 10 0 0 1 20 0v3M5 6a4 4 0 0 0 0 8m22-8a4 4 0 0 1 0 8"/></svg>'
};
const challenges = [
 { title: 'Conectá con la naturaleza', text: 'Participá en experiencias que cuiden el medio ambiente.', icon: 'nature' },
 { title: 'Compartí tu habilidad', text: 'Ayudá a través de lo que sabés hacer.', icon: 'skill' },
 { title: 'Conocé una nueva cultura', text: 'Participá en proyectos internacionales.', icon: 'world' },
 { title: 'Creá nuevos vínculos', text: 'Conectá con otras personas y compartí una experiencia.', icon: 'community' },
 { title: 'Dejá una huella verde', text: 'Sumá una pequeña acción para cuidar tu comunidad.', icon: 'nature' },
 { title: 'Un día sin plástico', text: 'Elegí alternativas reutilizables y compartí tu pequeño cambio.', icon: 'nature' },
 { title: 'Enseñá algo nuevo', text: 'Compartí una receta, un idioma o una habilidad con otra persona.', icon: 'skill' },
 { title: 'Descubrí tu comunidad', text: 'Conocé un proyecto local y encontrá una forma de colaborar.', icon: 'community' },
 { title: 'Viajá con otra mirada', text: 'Aprendé una costumbre del destino que te gustaría visitar.', icon: 'world' }
];
const joined = new Set(readLocal('skillway-community-challenges-v2', []));
let allChallengesVisible = true;
function joinLabel(index) { return joined.has(index) ? 'Te sumaste ✓' : 'Sumarme'; }
function renderChallenges() {
 document.querySelector('#monthly-challenge').innerHTML = `<article class="monthly-card"><div class="monthly-top"><span class="challenge-icon nature">${challengeIcons.nature}</span><div><span class="monthly-label">Reto del mes</span><h2>${challenges[0].title}</h2><p>${challenges[0].text}</p></div></div><div class="monthly-bottom"><div class="challenge-progress" role="progressbar" aria-label="Participantes del reto: objetivo 180 (demo)" aria-valuemin="0" aria-valuemax="180" aria-valuenow="${132+(joined.has(0)?1:0)}"><span style="width: ${((132+(joined.has(0)?1:0))/180)*100}%"></span></div><div class="challenge-participants"><div class="participant-avatars">${['mica','tomas','sofi','lucas'].map(name => `<img src="assets/${name} 2.jpeg" alt="" width="23" height="23">`).join('')}</div><span>${132+(joined.has(0)?1:0)} participantes</span></div><button class="join-monthly" data-challenge="0" aria-pressed="${joined.has(0)}">${joined.has(0) ? 'Te sumaste al reto ✓' : 'Sumarme al reto'}</button></div></article>`;
 document.querySelector('#challenge-list').innerHTML = challenges.slice(1).map((challenge, offset) => { const index = offset+1; return `<article class="compact-challenge" ${index>2 && !allChallengesVisible ? 'hidden' : ''}><span class="challenge-icon ${challenge.icon}">${challengeIcons[challenge.icon]}</span><div><h3>${challenge.title}</h3><p>${challenge.text}</p><button data-challenge="${index}" aria-pressed="${joined.has(index)}">${joinLabel(index)}</button></div></article>`; }).join('');
}
document.querySelector('#challenges-panel').addEventListener('click', event => {
 const button = event.target.closest('[data-challenge]'); if (!button) return;
 const index = Number(button.dataset.challenge);
 joined.has(index) ? joined.delete(index) : joined.add(index);
 writeLocal('skillway-community-challenges-v2', [...joined]); renderChallenges();
 document.querySelector(`[data-challenge="${index}"]`).focus();
});
document.querySelector('.show-all-challenges').addEventListener('click', event => { allChallengesVisible = !allChallengesVisible; event.target.setAttribute('aria-expanded', String(allChallengesVisible)); event.target.textContent = allChallengesVisible ? 'Ver menos' : 'Ver todos'; renderChallenges(); });
renderChallenges();
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab) {
 const showingChallenges = tab.id === 'challenges-tab';
 document.querySelector('.community-header h1').textContent = showingChallenges ? 'Retos' : 'Comunidad';
 document.querySelector('.community-header').classList.toggle('showing-challenges', showingChallenges);
 document.querySelector('.challenges-back').hidden = !showingChallenges;
 document.querySelector('.new-post').hidden = showingChallenges;
 document.querySelector('.community-tabs').hidden = showingChallenges;
 tabs.forEach(button => { const selected = button === tab; button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; document.querySelector('#'+button.getAttribute('aria-controls')).hidden = !selected; }); }
tabs.forEach((tab, index) => { tab.addEventListener('click', () => activateTab(tab)); tab.addEventListener('keydown', event => { if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return; event.preventDefault(); const next = tabs[event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1-index]; activateTab(next); next.focus(); }); });
const compose = document.querySelector('.compose-dialog');
document.querySelector('.new-post').addEventListener('click', () => compose.showModal());
document.querySelector('.close-compose').addEventListener('click', () => compose.close());
document.querySelector('#compose-form').addEventListener('submit', event => { event.preventDefault(); const text = event.target.elements.text.value.trim(); if (!text) return; personalPosts.unshift({id: 'local-'+Date.now(), name: 'Chiara', time: 'Recién · Solo en este navegador', place: 'Mi experiencia', text, likes: 0, comments: []}); writeLocal('skillway-community-posts', personalPosts); renderFeed(); activateTab(tabs[0]); compose.close(); event.target.reset(); document.querySelector('#posts-panel').scrollTop = 0; });

document.querySelector('.challenges-back').addEventListener('click', () => { activateTab(tabs[0]); tabs[1].focus(); });

const contactDialog = document.querySelector('.community-contact-dialog');
const contactForm = document.querySelector('#community-contact-form');
function openCommunityContact(post, mode) {
 const inviting = mode === 'invite';
 contactForm.reset(); contactDialog.dataset.mode = mode;
 document.querySelector('#community-contact-title').textContent = inviting ? 'Invitar a un grupo' : 'Mensaje privado';
 document.querySelector('.contact-recipient-name').textContent = post.name;
 const avatar = document.querySelector('.contact-recipient-avatar');
 avatar.replaceChildren();
 if (post.avatar) { const image = document.createElement('img'); image.src = post.avatar; image.alt = ''; avatar.append(image); }
 else avatar.textContent = post.name[0];
 document.querySelector('.community-group-field').hidden = !inviting;
 contactForm.elements.group.required = inviting;
 document.querySelector('#community-contact-text').placeholder = inviting ? 'Contale por qué te gustaría que se sume…' : `Hola ${post.name}, me encantó tu experiencia…`;
 document.querySelector('.community-contact-submit').textContent = inviting ? 'Probar invitación' : 'Probar envío de mensaje';
 document.querySelector('.community-contact-feedback').textContent = '';
 contactDialog.showModal();
}
document.querySelector('.close-community-contact').addEventListener('click', () => contactDialog.close());
contactForm.addEventListener('submit', event => {
 event.preventDefault();
 const inviting = contactDialog.dataset.mode === 'invite';
 const text = contactForm.elements.message.value.trim();
 if (!text) { contactForm.elements.message.focus(); return; }
 if (inviting && !contactForm.elements.group.value.trim()) { contactForm.elements.group.focus(); return; }
 document.querySelector('.community-contact-feedback').textContent = inviting
   ? 'Tu invitación está preparada. Es una demo: no se envió a la persona ni se agregó a nadie al grupo.'
   : 'Tu mensaje está preparado. Es una demo: no se envió a la persona.';
});
