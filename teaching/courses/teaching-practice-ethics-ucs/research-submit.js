(function(){
function cfg(){return (window.UCS_RESEARCH_CONFIG||{}).researchWebAppUrl||""}
function rid(){
  const cand=[...document.querySelectorAll('input')].find(x=>/rid|research/i.test(x.id||"")) ||
             [...document.querySelectorAll('input')].find(x=>x.maxLength===3 || x.getAttribute('maxlength')==="3");
  if(!cand)return "";
  const v=String(cand.value||"").replace(/\D/g,"").slice(0,3);
  return v.length===3?"UCS-"+v:"";
}
function assignment(){
  const b=document.body.innerText||"";
  const m=location.pathname.match(/case-(\d{2})\.html/i); if(m)return "C"+m[1];
  if(/w01-ai5ce-pre/i.test(location.pathname))return "AI5CE_PRE";
  if(/w18-ai5ce-post/i.test(location.pathname))return "AI5CE_POST";
  if(/w01-pre-assessment/i.test(location.pathname))return "PRE_MS";
  if(/my-sisters-keeper/i.test(location.pathname))return "FILM01";
  if(/extreme-measures/i.test(location.pathname))return "FILM02";
  if(/children-act/i.test(location.pathname))return "FILM03";
  if(/final-synthesis/i.test(location.pathname))return "FINAL_SYNTHESIS";
  if(/w18-post-reflection/i.test(location.pathname))return "POST_REF";
  if(/focus-group/i.test(location.pathname))return "FOCUS_GROUP_A13";
  return document.body.dataset.assignment||"UNKNOWN";
}
function collect(){
 const responses={};
 document.querySelectorAll('[data-code]').forEach(el=>{
   const k=el.dataset.code;if(!k)return;
   if(el.type==="radio"){if(el.checked)responses[k]=el.value}
   else if(el.type==="checkbox"){responses[k]=el.checked}
   else responses[k]=el.value;
 });
 return {schema:"UCS115-v19",research_id:rid(),assignment_code:assignment(),responses};
}
function fieldLabel(el){
  const code=el.dataset.code||el.name||"";
  const box=el.closest("section,.q,.question,.card,.panel,div");
  if(box){
    const lab=box.querySelector("label,h3,h4,strong,.question-title,.q-title");
    if(lab){
      const s=(lab.innerText||"").replace(/\s+/g," ").trim();
      if(s)return s+(code?" ["+code+"]":"");
    }
  }
  const prev=el.previousElementSibling;
  if(prev){
    const s=(prev.innerText||"").replace(/\s+/g," ").trim();
    if(s)return s+(code?" ["+code+"]":"");
  }
  return code||"未命名欄位";
}
function validate(){
 const missing=[];
 const seenRadio=new Set();
 document.querySelectorAll('textarea[required],input[required],select[required]').forEach(el=>{
   if(el.type==="radio"){
     if(seenRadio.has(el.name))return;
     seenRadio.add(el.name);
     if(!document.querySelector(`input[name="${CSS.escape(el.name)}"]:checked`)) missing.push({key:el.name,label:fieldLabel(el),el});
   } else if(el.type==="checkbox"){
     if(!el.checked) missing.push({key:el.dataset.code||el.name||"field",label:fieldLabel(el),el});
   } else if(!String(el.value||"").trim()) missing.push({key:el.dataset.code||el.name||"field",label:fieldLabel(el),el});
 });
 return missing;
}
async function send(){
 const url=cfg(); if(!url){alert("Research submission is not configured yet. Please contact the instructor.");return}
 const data=collect();if(!/^UCS-\d{3}$/.test(data.research_id)){alert("請輸入三碼研究 ID。");return}
 const btn=document.getElementById("ucs-research-submit");btn.disabled=true;btn.textContent="送出中…";
 try{
   // text/plain avoids browser preflight with Apps Script Web Apps.
   const res=await fetch(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(data)});
   const out=await res.json();
   if(!out.ok)throw new Error(out.error||"Submission failed");
   btn.textContent="✓ 已送出研究資料";
   localStorage.setItem("UCS_SUBMITTED_"+data.assignment_code,JSON.stringify({at:new Date().toISOString(),research_id:data.research_id}));
   alert("研究資料已成功送出。\\nResearch ID: "+data.research_id+"\\nAssignment: "+data.assignment_code);
 }catch(e){
   btn.disabled=false;btn.textContent="送出研究資料";
   alert("送出未成功。請保留目前頁面資料並告知教師。\\n"+e.message);
 }
}
function add(){
 if(document.getElementById("ucs-research-submit"))return;
 const box=document.createElement("div");box.style.cssText="max-width:1000px;margin:22px auto;padding:16px;background:#eef5f7;border-radius:12px;border:1px solid #c8d8df";
 box.innerHTML='<h3 style="margin-top:0">研究資料送出</h3><p>可自由前後瀏覽與作答。可依自己的學習進度自由作答，不限制作答長度或題數；研究資料不包含姓名或學號。</p><button id="ucs-research-submit" type="button" style="background:#285b75;color:white;border:0;border-radius:8px;padding:11px 16px;font-weight:700">送出研究資料</button>';
 document.body.appendChild(box);document.getElementById("ucs-research-submit").addEventListener("click",send);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add);else add();
})();