const conversations = [
 {id:'lucas',name:'Lucas',avatar:'assets/lucas 2.jpeg',time:'10:24',text:'¡Hola! Sí, todavía hay lugar :)'},
 {id:'mica',name:'Mica',avatar:'assets/mica 2.jpeg',time:'Ayer',text:'Genial, nos vemos entonces.'},
 {id:'italia',name:'Proyecto Italia',group:true,time:'Ayer',text:'Te enviaron información adicional.'},
 {id:'sofi',name:'Sofi',avatar:'assets/sofi 2.jpeg',time:'Lun',text:'¡Voy la próxima semana!'},
 {id:'tomas',name:'Tomás',avatar:'assets/tomas 2.jpeg',time:'Lun',text:'Dale, cualquier cosa me avisás.'},
 {id:'vale',name:'Vale',avatar:'assets/vale 2.jpeg',time:'Dom',text:'Gracias por la recomendación.'},
 {id:'nico',name:'Nico',avatar:'assets/nico 2.jpeg',time:'Dom',text:'¿Te sumás al próximo proyecto?'}
];
const groupIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M4 5a3 3 0 0 0 0 6m16-6a3 3 0 0 1 0 6"/></svg>';
const escapeText = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let localMessages;try{localMessages=JSON.parse(localStorage.getItem('skillway-chats')||'{}');}catch{localMessages={};}
let selected=null;
function avatar(contact){return contact.avatar?`<img src="${contact.avatar}" alt="">`:groupIcon;}
function renderInbox(){document.querySelector('#conversation-list').innerHTML=conversations.map(contact=>{const messages=localMessages[contact.id]||[];const last=messages.at(-1);return `<button class="conversation-row" data-contact="${contact.id}"><span class="inbox-avatar ${contact.group?'is-group':''}">${avatar(contact)}</span><span class="conversation-copy"><strong>${contact.name}</strong><span>${escapeText(last?'Vos: '+last.text:contact.text)}</span></span><time>${last?'Hoy':contact.time}</time></button>`;}).join('');}
function renderChat(){const history=document.querySelector('.chat-history');history.replaceChildren();const initial=document.createElement('p');initial.className='chat-bubble incoming';initial.textContent=selected.text;history.append(initial);(localMessages[selected.id]||[]).forEach(message=>{const entry=document.createElement('p');entry.className='chat-bubble outgoing';entry.textContent=message.text;history.append(entry);});history.scrollTop=history.scrollHeight;}
function openChat(id){selected=conversations.find(c=>c.id===id);if(!selected)return;document.querySelector('.inbox').hidden=true;document.querySelector('.conversation-view').hidden=false;document.querySelector('#chat-title').textContent=selected.name;document.querySelector('.chat-avatar').innerHTML=avatar(selected);document.querySelector('#chat-form').reset();renderChat();}
document.querySelector('#conversation-list').addEventListener('click',event=>{const button=event.target.closest('[data-contact]');if(button)openChat(button.dataset.contact);});
document.querySelector('.close-chat').addEventListener('click',()=>{document.querySelector('.conversation-view').hidden=true;document.querySelector('.inbox').hidden=false;renderInbox();});
document.querySelector('#chat-form').addEventListener('submit',event=>{event.preventDefault();const text=event.target.elements.text.value.trim();if(!text)return;(localMessages[selected.id]||=[]).push({text});try{localStorage.setItem('skillway-chats',JSON.stringify(localMessages));}catch{}event.target.reset();renderChat();});
const composer=document.querySelector('.new-conversation');
document.querySelector('#new-contact-list').innerHTML=conversations.map(contact=>`<button data-contact="${contact.id}"><span class="inbox-avatar">${avatar(contact)}</span>${contact.name}</button>`).join('');
document.querySelector('.compose-message').addEventListener('click',()=>composer.showModal());document.querySelector('.close-new').addEventListener('click',()=>composer.close());document.querySelector('#new-contact-list').addEventListener('click',event=>{const button=event.target.closest('[data-contact]');if(button){composer.close();openChat(button.dataset.contact);}});
renderInbox();
