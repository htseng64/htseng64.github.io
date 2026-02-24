function copyPrompt(){
  const el = document.getElementById("promptBox");
  const text = el ? el.innerText.trim() : "";
  if(!text) return alert("找不到提示詞區塊");
  navigator.clipboard.writeText(text).then(()=>{
    alert("已複製提示詞！");
  }).catch(()=>{
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    alert("已複製提示詞！");
  });
}