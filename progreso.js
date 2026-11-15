let profile;try{profile=JSON.parse(localStorage.getItem('skillway-profile')||'{}');}catch{profile={};}
const skills=Array.isArray(profile.skills)?profile.skills:[];
document.querySelector('#progress-skills-count').textContent=skills.length;
const list=document.querySelector('#progress-skills');
if(skills.length){list.className='progress-skill-grid';skills.forEach(skill=>{const item=document.createElement('div');item.className='progress-skill-card';const check=document.createElement('span');check.textContent='✓';check.setAttribute('aria-hidden','true');const name=document.createElement('strong');name.textContent=skill;item.append(check,name);list.append(item);});}
else{const empty=document.createElement('p');empty.className='no-progress-skills';empty.textContent='Todavía no elegiste habilidades. Agregalas desde “Mis habilidades” en tu perfil.';list.append(empty);}
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selectProgress(tab){tabs.forEach(button=>{const active=button===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;document.getElementById(button.getAttribute('aria-controls')).hidden=!active;});}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectProgress(tab));tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=tabs[event.key==='Home'?0:event.key==='End'?1:1-index];selectProgress(next);next.focus();});});
