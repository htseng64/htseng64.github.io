import { useState } from "react";

const UNITS = [
  { id: 1, title: "護理倫理概論", en: "Introduction to Nursing Ethics", icon: "🌱", color: ["#1a6b5a","#2a9b7a"], topics: ["倫理學基礎", "護理專業價值觀", "道德推理"], duration: "45 min", slides: 13 },
  { id: 2, title: "自主原則", en: "Principle of Autonomy", icon: "⚖️", color: ["#1e5a8a","#2e80c8"], topics: ["知情同意", "病人自主", "拒絕治療"], duration: "50 min", slides: 15 },
  { id: 3, title: "行善與不傷害原則", en: "Beneficence & Non-maleficence", icon: "❤️", color: ["#8a1e2e","#c84040"], topics: ["最佳利益", "風險效益分析", "護理介入"], duration: "55 min", slides: 18 },
  { id: 4, title: "公平正義原則", en: "Justice & Fairness", icon: "🔱", color: ["#5a4e1a","#9a842e"], topics: ["資源分配", "平等照護", "優先順序"], duration: "45 min", slides: 14 },
  { id: 5, title: "護病關係與信任", en: "Nurse-Patient Relationship", icon: "🤝", color: ["#3a1a6b","#6a3aab"], topics: ["治療性溝通", "專業界線", "信任建立"], duration: "50 min", slides: 16 },
  { id: 6, title: "知情同意與告知", en: "Informed Consent & Disclosure", icon: "📋", color: ["#1a4a6b","#2a6a9b"], topics: ["同意書程序", "資訊揭露", "語言障礙"], duration: "60 min", slides: 20 },
  { id: 7, title: "隱私權與保密義務", en: "Privacy & Confidentiality", icon: "🔒", color: ["#2e4a2e","#4a7a4a"], topics: ["病歷保密", "個資保護", "社群媒體"], duration: "45 min", slides: 13 },
  { id: 8, title: "生命末期照護倫理", en: "End-of-Life Care Ethics", icon: "🕊️", color: ["#4a2e4a","#7a4a7a"], topics: ["善終理念", "預立醫療決定", "緩和照護"], duration: "65 min", slides: 22 },
  { id: 9, title: "安樂死與協助死亡", en: "Euthanasia & Assisted Dying", icon: "⚕️", color: ["#6b2e1a","#a84a2a"], topics: ["主動/被動安樂死", "法律規範", "護理角色"], duration: "55 min", slides: 17 },
  { id: 10, title: "護理專業責任", en: "Professional Accountability", icon: "🛡️", color: ["#1a3a5a","#2a5a8a"], topics: ["護理過失", "責任歸屬", "事件通報"], duration: "50 min", slides: 15 },
  { id: 11, title: "醫療法律基礎", en: "Medical Law Fundamentals", icon: "⚖️", color: ["#5a3a1a","#8a5a2a"], topics: ["護理相關法規", "民刑事責任", "台灣法律"], duration: "60 min", slides: 19 },
  { id: 12, title: "護理紀錄與文件", en: "Nursing Documentation & Records", icon: "📝", color: ["#1a5a4a","#2a8a6a"], topics: ["記錄倫理", "法律文件效力", "電子病歷"], duration: "45 min", slides: 14 },
  { id: 13, title: "文化敏感度與多元照護", en: "Cultural Sensitivity & Diverse Care", icon: "🌏", color: ["#2a4a6a","#4a6a9a"], topics: ["跨文化溝通", "宗教信仰", "語言差異"], duration: "50 min", slides: 16 },
  { id: 14, title: "護理倫理困境與決策", en: "Ethical Dilemmas & Decision-Making", icon: "🧩", color: ["#4a1a5a","#7a3a8a"], topics: ["倫理決策模式", "案例分析", "多元視角"], duration: "65 min", slides: 21 },
  { id: 15, title: "護理倫理實踐與未來", en: "Nursing Ethics in Practice", icon: "🚀", color: ["#1a4a3a","#2a7a5a"], topics: ["AI與護理倫理", "未來挑戰", "專業發展"], duration: "55 min", slides: 18 },
];

const PROGRESS_KEY = "nursingCourseProgress";

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}

export default function CourseHub() {
  const [progress, setProgress] = useState(loadProgress);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const markDone = (id) => {
    const p = { ...progress, [id]: "done" };
    setProgress(p); saveProgress(p);
  };
  const markInProgress = (id) => {
    const p = { ...progress, [id]: "progress" };
    setProgress(p); saveProgress(p);
  };
  const resetUnit = (id) => {
    const p = { ...progress };
    delete p[id];
    setProgress(p); saveProgress(p);
  };

  const filtered = UNITS.filter(u => {
    const matchSearch = !search || u.title.includes(search) || u.en.toLowerCase().includes(search.toLowerCase()) || u.topics.some(t => t.includes(search));
    const matchFilter = filter === "all" || (filter === "done" && progress[u.id] === "done") || (filter === "progress" && progress[u.id] === "progress") || (filter === "todo" && !progress[u.id]);
    return matchSearch && matchFilter;
  });

  const doneCount = UNITS.filter(u => progress[u.id] === "done").length;
  const progCount = UNITS.filter(u => progress[u.id] === "progress").length;
  const totalPct = Math.round((doneCount / UNITS.length) * 100);

  const openUnit = (unit) => {
    setSelected(unit);
    if (!progress[unit.id]) markInProgress(unit.id);
  };

  return (
    <div style={{ background:"#f0f4f8", minHeight:"100vh", fontFamily:"'Noto Sans TC', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{
        background:"linear-gradient(135deg, #0f2944 0%, #1a5a7a 60%, #1a7a6a 100%)",
        padding:"0", position:"relative", overflow:"hidden"
      }}>
        {/* Decorative circles */}
        {[...Array(5)].map((_,i) => (
          <div key={i} style={{
            position:"absolute",
            width: 200 + i*80, height: 200 + i*80,
            borderRadius:"50%",
            border:"1px solid rgba(255,255,255,0.06)",
            top: "50%", left: "50%",
            transform:`translate(-50%,-50%)`,
            pointerEvents:"none"
          }} />
        ))}
        <div style={{ position:"relative", zIndex:1, padding:"36px 32px 28px", maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
            <div>
              <div style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:8 }}>
                護理學系 · Nursing Department
              </div>
              <h1 style={{ fontSize:"1.9rem", fontWeight:800, color:"white", letterSpacing:-0.5, marginBottom:6, lineHeight:1.2 }}>
                護理倫理與醫療法律
              </h1>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:13, marginBottom:20 }}>
                Nursing Ethics & Medical Law · 15 Units
              </p>
              {/* Overall progress */}
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ flex:1, maxWidth:260 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>整體進度</span>
                    <span style={{ fontSize:11, color:"#4fffb0", fontWeight:700 }}>{totalPct}%</span>
                  </div>
                  <div style={{ height:5, background:"rgba(255,255,255,0.12)", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:totalPct+"%", background:"linear-gradient(90deg,#4fffb0,#00cfff)", borderRadius:3, transition:"width 0.6s ease" }} />
                  </div>
                </div>
                <div style={{ display:"flex", gap:16 }}>
                  {[
                    { label:"完成", value:doneCount, color:"#4fffb0" },
                    { label:"進行中", value:progCount, color:"#ffd166" },
                    { label:"未開始", value:UNITS.length-doneCount-progCount, color:"rgba(255,255,255,0.4)" }
                  ].map(s => (
                    <div key={s.label} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:"1.3rem", fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginTop:2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:"3.5rem", lineHeight:1, marginBottom:4 }}>⚕️</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Articulate Storyline 3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background:"white", borderBottom:"1px solid #e2e8f0", padding:"14px 32px", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜尋單元、主題… Search units…"
            style={{
              flex:1, minWidth:200, padding:"8px 14px", borderRadius:8,
              border:"1.5px solid #e2e8f0", fontSize:13, outline:"none",
              fontFamily:"inherit", background:"#f8fafc", color:"#1a2a3a"
            }}
          />
          {["all","todo","progress","done"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"7px 16px", borderRadius:20, fontSize:12, fontWeight:600,
              border:"none", cursor:"pointer", fontFamily:"inherit",
              background: filter===f ? "#0f2944" : "#f0f4f8",
              color: filter===f ? "white" : "#4a6080",
              transition:"all 0.2s"
            }}>
              {{ all:"全部 All", todo:"未開始", progress:"進行中", done:"✅ 完成" }[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 32px 60px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"#8aa0b8" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:12 }}>🔍</div>
            <div style={{ fontSize:15 }}>找不到符合的單元</div>
          </div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
          {filtered.map(unit => {
            const st = progress[unit.id];
            const isDone = st === "done";
            const isInProg = st === "progress";
            return (
              <div
                key={unit.id}
                onClick={() => openUnit(unit)}
                style={{
                  background:"white",
                  borderRadius:14,
                  overflow:"hidden",
                  boxShadow: isDone ? "0 2px 16px rgba(79,255,176,0.15)" : "0 2px 12px rgba(0,0,0,0.07)",
                  border: isDone ? "1.5px solid rgba(79,200,140,0.4)" : isInProg ? "1.5px solid rgba(255,209,102,0.4)" : "1.5px solid #e8eef4",
                  cursor:"pointer",
                  transition:"transform 0.22s, box-shadow 0.22s",
                  transform:"translateY(0)",
                  position:"relative"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.13)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow = isDone?"0 2px 16px rgba(79,255,176,0.15)":"0 2px 12px rgba(0,0,0,0.07)"; }}
              >
                {/* Status badge */}
                {(isDone || isInProg) && (
                  <div style={{
                    position:"absolute", top:10, right:10, zIndex:2,
                    fontSize:10, fontWeight:700, letterSpacing:0.5,
                    padding:"3px 8px", borderRadius:10,
                    background: isDone ? "rgba(79,200,140,0.15)" : "rgba(255,209,102,0.2)",
                    color: isDone ? "#1a8a5a" : "#a07000"
                  }}>
                    {isDone ? "✓ 完成" : "▶ 進行中"}
                  </div>
                )}

                {/* Card header */}
                <div style={{
                  background:`linear-gradient(135deg, ${unit.color[0]}, ${unit.color[1]})`,
                  padding:"20px 18px 16px", position:"relative"
                }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{unit.icon}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)", letterSpacing:0.5 }}>Unit {unit.id}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:"white", lineHeight:1.3, marginTop:2 }}>
                    {unit.title}
                  </div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginTop:3 }}>{unit.en}</div>
                </div>

                {/* Card body */}
                <div style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                    {unit.topics.map(t => (
                      <span key={t} style={{
                        fontSize:10, padding:"2px 8px", borderRadius:10,
                        background:"#f0f4f8", color:"#4a6080"
                      }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#8aa0b8", borderTop:"1px solid #f0f4f8", paddingTop:10 }}>
                    <span>⏱ {unit.duration}</span>
                    <span>📑 {unit.slides} slides</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal / Unit detail */}
      {selected && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
          style={{
            position:"fixed", inset:0, background:"rgba(10,20,40,0.7)",
            zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20
          }}
        >
          <div style={{
            background:"white", borderRadius:18, maxWidth:480, width:"100%",
            overflow:"hidden", animation:"popIn 0.25s ease",
            maxHeight:"90vh", overflowY:"auto"
          }}>
            <style>{`@keyframes popIn { from { transform:scale(0.93) translateY(8px); opacity:0; } to { transform:scale(1) translateY(0); opacity:1; } }`}</style>
            
            {/* Modal header */}
            <div style={{ background:`linear-gradient(135deg, ${selected.color[0]}, ${selected.color[1]})`, padding:"26px 24px 20px", position:"relative" }}>
              <button onClick={() => setSelected(null)} style={{
                position:"absolute", top:14, right:14,
                background:"rgba(255,255,255,0.15)", border:"none",
                color:"white", width:30, height:30, borderRadius:"50%",
                cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center"
              }}>✕</button>
              <div style={{ fontSize:36, marginBottom:8 }}>{selected.icon}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)", marginBottom:4 }}>Unit {selected.id}</div>
              <div style={{ fontSize:"1.3rem", fontWeight:800, color:"white", marginBottom:3 }}>{selected.title}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>{selected.en}</div>
            </div>

            <div style={{ padding:"20px 24px 26px" }}>
              {/* Info row */}
              <div style={{ display:"flex", gap:20, marginBottom:18, paddingBottom:16, borderBottom:"1px solid #f0f4f8" }}>
                {[{ label:"時長", val:selected.duration }, { label:"投影片", val:selected.slides+" slides" }, { label:"狀態", val:progress[selected.id]==="done"?"✅ 完成":progress[selected.id]==="progress"?"▶ 進行中":"⏳ 未開始" }].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize:10, color:"#8aa0b8", marginBottom:3 }}>{item.label}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1a2a3a" }}>{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Topics */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#1a2a3a", marginBottom:10 }}>📚 課程主題</div>
                {selected.topics.map(t => (
                  <div key={t} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderBottom:"1px solid #f8fafc", fontSize:13, color:"#4a6080" }}>
                    <span style={{ color:selected.color[1], fontSize:10 }}>▸</span>{t}
                  </div>
                ))}
              </div>

              {/* Launch button */}
              <a
                href={`Unit${selected.id}/開始課程.html`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => markInProgress(selected.id)}
                style={{
                  display:"block", width:"100%", padding:"14px",
                  background:`linear-gradient(135deg, ${selected.color[0]}, ${selected.color[1]})`,
                  color:"white", textAlign:"center", borderRadius:10,
                  textDecoration:"none", fontWeight:800, fontSize:14,
                  marginBottom:10, letterSpacing:0.3,
                  boxShadow:`0 4px 20px ${selected.color[0]}55`
                }}
              >
                🚀 開始課程 · Launch Unit {selected.id}
              </a>

              {/* Mark buttons */}
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => { markDone(selected.id); setSelected(null); }} style={{
                  flex:1, padding:"10px", borderRadius:8, border:"1.5px solid #d0e8d8",
                  background:"#f0faf4", color:"#1a7a4a", fontWeight:700, fontSize:12,
                  cursor:"pointer", fontFamily:"inherit"
                }}>✅ 標記完成</button>
                <button onClick={() => { resetUnit(selected.id); setSelected(null); }} style={{
                  flex:1, padding:"10px", borderRadius:8, border:"1.5px solid #e8e0f0",
                  background:"#f8f4fc", color:"#7a5a9a", fontWeight:700, fontSize:12,
                  cursor:"pointer", fontFamily:"inherit"
                }}>↺ 重置進度</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
