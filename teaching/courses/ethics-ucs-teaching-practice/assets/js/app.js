const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function setMode(m){document.body.classList.remove('teacher','student');document.body.classList.add(m);localStorage.setItem('ethicsMode',m);if(m==='teacher'){showScreen(+localStorage.getItem('ethicsScreen')||0)}}
function showScreen(n){let a=$$('.screen');if(!a.length)return;n=Math.max(0,Math.min(n,a.length-1));a.forEach((x,i)=>x.classList.toggle('active',i===n));localStorage.setItem('ethicsScreen',n);let p=$('.progress i');if(p)p.style.width=((n+1)/a.length*100)+'%'}
function move(d){let a=$$('.screen');if(!a.length||!document.body.classList.contains('teacher'))return;let n=a.findIndex(x=>x.classList.contains('active'));showScreen(n+d)}
document.addEventListener('keydown',e=>{if(['ArrowRight',' ','PageDown'].includes(e.key)){e.preventDefault();move(1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();move(-1)}if(e.key.toLowerCase()==='f'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName))document.documentElement.requestFullscreen?.()});
document.addEventListener('DOMContentLoaded',()=>setMode(localStorage.getItem('ethicsMode')||'student'));
function saveDraft(k,el){localStorage.setItem('ethics:'+k,el.value)}
function restoreDrafts(){$$('[data-draft]').forEach(x=>x.value=localStorage.getItem('ethics:'+x.dataset.draft)||'')}
function unlock(id,need){let x=$('[data-draft="'+need+'"]');if(x&&!x.value.trim()){alert('請先完成自己的回答，再進入下一段。');return}$('#'+id)?.classList.add('open');$('#'+id)?.scrollIntoView({behavior:'smooth'})}
document.addEventListener('DOMContentLoaded',restoreDrafts);