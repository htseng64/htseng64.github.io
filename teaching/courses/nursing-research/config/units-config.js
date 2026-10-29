window.UNITS_CONFIG = [
  {
    module: "Module 1",
    moduleTitle: "護理研究與實證護理基礎",
    weeks: [
      {week:"W1", title:"課程導入與護理研究概論（一）", en:"Course orientation and introduction to nursing research I"},
      {week:"W2", title:"護理研究概論（二）與實證護理應用", en:"Introduction to nursing research II and evidence-based practice"}
    ]
  },
  {
    module: "Module 2",
    moduleTitle: "研究問題、文獻查證與研究架構",
    weeks: [
      {week:"W3", title:"研究題目、研究問題、目的、提案與假設", en:"Research topics, questions, purposes, proposals and hypotheses"},
      {week:"W4", title:"文獻查證與文獻閱讀分析", en:"Literature review and critical reading"},
      {week:"W5", title:"名詞界定與研究架構之形成", en:"Variables and research framework"}
    ]
  },
  {
    module: "Module 3",
    moduleTitle: "研究設計、取樣與測量工具",
    weeks: [
      {week:"W6", title:"研究設計總論", en:"Overview of research design"},
      {week:"W7", title:"研究取樣之考量與方法", en:"Sampling considerations and methods"},
      {week:"W8", title:"研究工具之信度與效度", en:"Reliability and validity of instruments"}
    ]
  },
  {
    module: "Module 4",
    moduleTitle: "期中整合與研究倫理",
    weeks: [
      {week:"W9", title:"期中考與階段性學習檢核", en:"Midterm and formative evaluation"},
      {week:"W10", title:"研究倫理與法律考量", en:"Ethical and legal issues in research"}
    ]
  },
  {
    module: "Module 5",
    moduleTitle: "質性研究與文章導讀",
    weeks: [
      {week:"W11", title:"質性研究：緒論與研究設計（一）", en:"Introduction to qualitative research I"},
      {week:"W12", title:"質性研究：研究設計與方法（二）", en:"Qualitative research design and methods II"},
      {week:"W13", title:"質性論文導讀與討論", en:"Reading and discussing qualitative research articles"}
    ]
  },
  {
    module: "Module 6",
    moduleTitle: "量性研究設計與文章導讀",
    weeks: [
      {week:"W14", title:"非實驗性研究設計", en:"Non-experimental research design"},
      {week:"W15", title:"實驗性研究設計", en:"Experimental research design"},
      {week:"W16", title:"量性論文導讀與討論", en:"Reading and discussing quantitative research articles"}
    ]
  },
  {
    module: "Module 7",
    moduleTitle: "綜合應用、成果整理與期末評量",
    weeks: [
      {week:"W17", title:"綜合活動、文章評析與期末複習", en:"Integration, article critique and final review"},
      {week:"W18", title:"期末考與整體教學評量", en:"Final exam and overall course evaluation"}
    ]
  }
];

// Flatten for pages that use simple week list
window.UNITS_FLAT = window.UNITS_CONFIG.flatMap(m => m.weeks.map(w => ({
  module: m.module,
  moduleTitle: m.moduleTitle,
  week: w.week,
  date: w.week,
  title: w.title,
  en: w.en,
  teacher: ""
})));
