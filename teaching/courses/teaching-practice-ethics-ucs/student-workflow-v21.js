/* UCS115 Student Work Persistence v21
   Local save + JSON backup/import + TronClass printable PDF + research submission compatibility.
   No Google Apps Script change required. */
(function(){
'use strict';
const VERSION='UCS115-STUDENT-v21';
function assignment(){
 const p=location.pathname;
 let m=p.match(/case-(\d{2})\.html/i); if(m)return 'C'+m[1];
 if(/w01-pre-assessment/i.test(p))return 'PRE_MS'; if(/w01-ai5ce-pre/i.test(p))return 'AI5CE_PRE';
 if(/my-sisters-keeper/i.test(p))return 'FILM01'; if(/extreme-measures/i.test(p))return 'FILM02';
 if(/children-act/i.test(p))return 'FILM03'; if(/final-synthesis/i.test(p))return 'FINAL_SYNTHESIS';
 if(/w18-post-reflection/i.test(p))return 'POST_REF'; if(/w18-ai5ce-post/i.test(p))return 'AI5CE_POST';
 if(/focus-group/i.test(p))return 'FOCUS_GROUP_A13'; return document.body.dataset.assignment||document.title||'PAGE';
}
const A=assignment(), KEY='UCS115_WORK_V21_'+A;
function controls(){return [...document.querySelectorAll('textarea,select,input')].filter(e=>!['button','submit','reset','file','hidden'].includes((e.type||'').toLowerCase()));}
function ridEl(){return document.getElementById('researchId')||[...document.querySelectorAll('input')].find(x=>/research/i.test(x.id||''));}
function fieldKey(e,i){return e.dataset.code||e.dataset.rcode||e.id||(e.name?e.name+((e.type==='radio'||e.type==='checkbox')?':'+e.value:''):'FIELD_'+i);}
function ensureCodes(){
 let n=0; controls().forEach((e,i)=>{ if(e===ridEl())return; if(!e.dataset.code){ e.dataset.code=e.dataset.rcode||e.id||(`${A}.LOCAL.Q${String(++n).padStart(3,'0')}`); }});
}
function snapshot(){
 ensureCodes(); const values={}; controls().forEach((e,i)=>{const k=fieldKey(e,i); if(e.type==='radio') {if(e.checked) values[k]=e.value; else if(!(k in values)) values[k]='';} else if(e.type==='checkbox') values[k]=!!e.checked; else values[k]=e.value;});
 return {schema:VERSION,assignment_code:A,page_title:document.title,saved_at:new Date().toISOString(),values};
}
function apply(d){
 if(!d||!d.values)return; ensureCodes(); controls().forEach((e,i)=>{const k=fieldKey(e,i); if(!(k in d.values))return; const v=d.values[k]; if(e.type==='radio')e.checked=String(e.value)===String(v); else if(e.type==='checkbox')e.checked=!!v; else e.value=v??'';});
 aiRefresh(); status('已載入儲存進度');
}
function status(t){let s=document.getElementById('ucs-save-state')||document.getElementById('saveState'); if(s)s.textContent=t;}
function save(silent=false){try{const d=snapshot(); localStorage.setItem(KEY,JSON.stringify(d)); status('✓ 已儲存 '+new Date().toLocaleTimeString()); if(!silent)toast('已儲存在這台裝置'); return true;}catch(e){alert('此裝置無法儲存：'+e.message+'\n請立即使用「匯出 JSON 備份」。');return false;}}
function restore(){try{const raw=localStorage.getItem(KEY);if(raw)apply(JSON.parse(raw));}catch(e){console.warn(e)}}
function download(name,text,type){const b=new Blob([text],{type:(type||'application/json')+';charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function exportBackup(){save(true);const d=snapshot();download(`${A}_作答備份_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(d,null,2));toast('JSON 已匯出：用於備份／換手機繼續作答，不是 TronClass 作業，也不是研究資料。')}
function importBackup(file){if(!file)return;const fr=new FileReader();fr.onload=()=>{try{const d=JSON.parse(fr.result);if(d.assignment_code&&d.assignment_code!==A&&!confirm(`這是 ${d.assignment_code} 的備份，目前頁面是 ${A}。仍要匯入嗎？`))return;apply(d);save(true);toast('JSON 備份已匯入並儲存在此裝置');}catch(e){alert('JSON 檔無法讀取：'+e.message)}};fr.readAsText(file,'utf-8')}
function questionFor(e){
 const box=e.closest('.q,.eval-item,.concept,.item,.question,.field,.card,section'); if(!box)return e.getAttribute('aria-label')||e.name||e.id||e.dataset.code||'';
 const h=box.querySelector('strong,b,label,h3,h4,.prompt,.question-text'); return (h?.innerText||'').replace(/\s+/g,' ').trim();
}
function academicRows(){ensureCodes(); const seen=new Set(),rows=[]; controls().forEach((e,i)=>{if(e===ridEl())return;const k=fieldKey(e,i);if(e.type==='radio'){if(!e.checked||seen.has(e.name))return;seen.add(e.name)};let v=e.type==='checkbox'?(e.checked?'是':'否'):e.value;if(!String(v??'').trim() && e.type!=='checkbox')return;rows.push({question:questionFor(e),answer:String(v??''),code:k});});return rows;}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function printTron(){save(true);const rows=academicRows();const title=document.querySelector('h1')?.innerText||document.title;const w=window.open('','_blank');if(!w){alert('瀏覽器阻擋列印視窗，請允許此網站開啟彈出視窗。');return}w.document.write(`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><title>${esc(A)}_TronClass</title><style>@page{size:A4;margin:16mm}body{font-family:"Microsoft JhengHei","Noto Sans TC",sans-serif;color:#222;line-height:1.6;font-size:12pt}h1{font-size:20pt;border-bottom:2px solid #333;padding-bottom:8px}.meta{color:#555;margin-bottom:18px}.qa{break-inside:avoid;margin:0 0 16px}.q{font-weight:700;margin-bottom:5px}.a{white-space:pre-wrap;border:1px solid #bbb;border-radius:6px;padding:9px;min-height:24px;background:#fff}.note{font-size:10pt;color:#666;border-top:1px solid #ccc;margin-top:25px;padding-top:8px}.code{display:none}</style></head><body><h1>${esc(title)}</h1><div class="meta">課程作業：${esc(A)}　｜　產生時間：${esc(new Date().toLocaleString())}</div>${rows.map((r,i)=>`<div class="qa"><div class="q">${i+1}. ${esc(r.question||'作答題目')}</div><div class="a">${esc(r.answer)}</div></div>`).join('')}<div class="note">此版本供 TronClass 課業繳交，包含題目與學生作答；不顯示 Research ID 與研究編碼。</div><script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`);w.document.close();}
function toast(msg){let x=document.getElementById('ucs-toast');if(!x){x=document.createElement('div');x.id='ucs-toast';x.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99999;background:#173b4d;color:#fff;padding:10px 15px;border-radius:9px;max-width:90%;box-shadow:0 3px 14px #0004';document.body.appendChild(x)}x.textContent=msg;x.style.display='block';clearTimeout(x._t);x._t=setTimeout(()=>x.style.display='none',3800)}
function aiRefresh(){try{document.dispatchEvent(new Event('ucsrestore'))}catch(_){}}
function addUI(){
 if(document.getElementById('ucs-workflow'))return; const box=document.createElement('section');box.id='ucs-workflow';box.style.cssText='max-width:1000px;margin:14px auto;padding:15px;background:#f7fbfd;border:2px solid #b8d3df;border-radius:14px;box-shadow:0 2px 8px #0001';
 box.innerHTML=`<h3 style="margin:0 0 7px">💾 作答保存與繳交</h3><p style="margin:5px 0 12px;color:#52636c">手機離開頁面前請按「儲存」。系統也會自動儲存。JSON 是<strong>個人備份／換裝置續答</strong>；TronClass 請使用 PDF（含題目與答案）；最下方「送出研究資料」只送研究編碼與答案，不送題目。</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="ucs-save">💾 儲存</button><button type="button" id="ucs-export">⬇ 匯出 JSON 備份</button><label style="display:inline-flex;align-items:center;padding:9px 13px;border-radius:9px;background:#e9edf0;color:#25313a;font-weight:700;cursor:pointer">⬆ 匯入 JSON 備份<input id="ucs-import" type="file" accept="application/json,.json" style="display:none"></label><button type="button" id="ucs-pdf">📄 送繳 TronClass（PDF｜含題目）</button><span id="ucs-save-state" style="align-self:center;color:#52636c;font-weight:700">尚未儲存</span></div>`;
 const anchor=document.querySelector('main')||document.body; anchor.parentNode.insertBefore(box,anchor);
 box.querySelector('#ucs-save').onclick=()=>save(false);box.querySelector('#ucs-export').onclick=exportBackup;box.querySelector('#ucs-import').onchange=e=>{importBackup(e.target.files[0]);e.target.value=''};box.querySelector('#ucs-pdf').onclick=printTron;
}
function init(){ensureCodes();addUI();restore();let t;document.addEventListener('input',()=>{status('編輯中…');clearTimeout(t);t=setTimeout(()=>save(true),500)},true);document.addEventListener('change',()=>save(true),true);window.addEventListener('pagehide',()=>save(true));document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save(true)});}
// Override legacy case-page save/export functions so old buttons also use the reliable v21 workflow.
window.saveAll=(silent=false)=>save(!!silent);window.exportJSON=exportBackup;window.exportAcademicJSON=exportBackup;window.exportTXT=()=>printTron();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
