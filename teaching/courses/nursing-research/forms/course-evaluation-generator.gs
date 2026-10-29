/**
 * 研究與實證護理概論｜課程評值與小組互評 Google Forms 一鍵產生器
 * 使用方式：
 * 1. 建立 Google Sheet，第一個工作表命名 students
 * 2. 欄位：學期、學號、姓名、組別、暱稱
 * 3. Extensions → Apps Script → 貼上本檔
 * 4. 執行 createAllResearchNursingForms()
 */
const COURSE_NAME = '研究與實證護理概論';
const SEMESTER = '115-1';
const TEACHER = '';
const CORE_ABILITIES = ['Ⅱ.基礎生物醫學科學','Ⅳ.批判性思考','Ⅵ.倫理素養','Ⅶ.克盡職責','Ⅷ.終身學習'];
const LEARNING_OUTCOMES = [
  '能說明護理研究各步驟之定義與目的。',
  '能比較質性與量性護理研究設計之重點。',
  '能說明研究工具信度與效度之建立方法。',
  '能於文章導讀時指出研究內容之優缺點。',
  '能分析研究結果之臨床應用價值。',
  '能指出研究者對研究對象的倫理保護措施。',
  '能有效率完成導讀與個人學習任務。',
  '能展現自我管理與持續學習能力。'
];

function createAllResearchNursingForms() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const students = getStudentList_();
  const course = createCourseEvaluationForm_();
  const peer = createPeerEvaluationForm_(students);
  createDashboardSheet_(ss, course, peer);
  Logger.log('課程評值表單填答連結：' + course.form.getPublishedUrl());
  Logger.log('課程評值表單編輯連結：' + course.form.getEditUrl());
  Logger.log('小組互評表單填答連結：' + peer.form.getPublishedUrl());
  Logger.log('小組互評表單編輯連結：' + peer.form.getEditUrl());
}

function getStudentList_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('students') || ss.getSheets()[0];
  const values = sh.getDataRange().getValues();
  const header = values[0].map(String);
  const idx = name => header.indexOf(name);
  if (values.length < 2 || idx('學號') < 0) throw new Error('students 欄位需為：學期、學號、姓名、組別、暱稱');
  return values.slice(1).filter(r => r.join('').trim() !== '').map(r => ({
    semester: r[idx('學期')] || SEMESTER,
    id: String(r[idx('學號')] || '').trim(),
    name: String(r[idx('姓名')] || '').trim(),
    team: String(r[idx('組別')] || '').trim(),
    nick: String(r[idx('暱稱')] || '').trim()
  }));
}

function createCourseEvaluationForm_() {
  const form = FormApp.create(`${SEMESTER} ${COURSE_NAME} 課程評值（匿名）`);
  form.setDescription('本表單採匿名填答，用於了解課程設計、數位教材、遊戲式學習與文章導讀對學習之幫助。');
  form.setCollectEmail(false);
  addScaleGrid_(form, '一、教學目標達成程度', [
    '我能了解護理研究及實證與護理專業發展的重要性。',
    '我能理解護理研究的主要步驟。',
    '我能比較質性與量性研究方法的優缺點。',
    '我能理解研究工具信度與效度的概念。',
    '我能初步區辨不同研究方法與已發表研究文獻內容。'
  ]);
  addScaleGrid_(form, '二、核心能力達成程度', CORE_ABILITIES.map(x => `本課程有助於我提升「${x}」相關能力。`));
  addScaleGrid_(form, '三、學習成果標準達成程度', LEARNING_OUTCOMES);
  addScaleGrid_(form, '四、數位學習與遊戲式學習成效', [
    '自主學習平台有助於我理解護理研究概念。',
    '互動遊戲有助於我複習護理研究重要名詞。',
    '即時測驗與解析有助於我檢視學習盲點。',
    '網站與手機操作便利，能提升我的學習意願。',
    '課程活動有助於我進行文章導讀與研究判讀。'
  ]);
  form.addParagraphTextItem().setTitle('請寫下本課程最幫助你學習的一個設計或活動，並說明原因。');
  form.addParagraphTextItem().setTitle('哪一個活動最能幫助你理解「研究與實證護理」的臨床應用？');
  form.addParagraphTextItem().setTitle('請提供一項你對本課程的正向回饋或建議。');
  const dest = SpreadsheetApp.create(`${SEMESTER}_${COURSE_NAME}_課程評值回覆`);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, dest.getId());
  return {form, sheet: dest};
}

function createPeerEvaluationForm_(students) {
  const form = FormApp.create(`${SEMESTER} ${COURSE_NAME} 小組互評`);
  form.setDescription('本表單用於小組合作互評，需填寫學號並選擇同組組員。');
  form.setCollectEmail(false);
  form.addListItem().setTitle('你的學號').setRequired(true)
    .setChoiceValues(students.map(s => `${s.id} ${s.name}（${s.team}）`));
  form.addListItem().setTitle('你的組別').setRequired(true)
    .setChoiceValues([...new Set(students.map(s => s.team).filter(Boolean))]);
  form.addListItem().setTitle('你要評分的組員').setRequired(true)
    .setChoiceValues(students.map(s => `${s.id} ${s.name}（${s.team}）`));
  addScaleGrid_(form, '小組合作互評', [
    '主動參與小組討論與任務分工。',
    '能準時完成分配工作。',
    '能清楚表達想法並尊重他人意見。',
    '能協助小組整合文章導讀或報告內容。',
    '整體而言，對本組學習成果有具體貢獻。'
  ]);
  form.addParagraphTextItem().setTitle('請寫下此組員最值得肯定的一項貢獻。');
  form.addParagraphTextItem().setTitle('若有建議，請具體說明此組員未來可以再加強的地方。');
  const dest = SpreadsheetApp.create(`${SEMESTER}_${COURSE_NAME}_小組互評回覆`);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, dest.getId());
  return {form, sheet: dest};
}

function addScaleGrid_(form, title, rows) {
  form.addGridItem().setTitle(title).setRows(rows)
    .setColumns(['1 非常不同意','2 不同意','3 普通','4 同意','5 非常同意'])
    .setRequired(true);
}

function createDashboardSheet_(ss, course, peer) {
  let sh = ss.getSheetByName('dashboard') || ss.insertSheet('dashboard');
  sh.clear();
  sh.getRange('A1').setValue('研究與實證護理概論｜評值統計儀表板');
  sh.getRange('A3:B8').setValues([
    ['課程名稱', COURSE_NAME],
    ['學期', SEMESTER],
    ['教師', TEACHER],
    ['課程評值填答連結', course.form.getPublishedUrl()],
    ['小組互評填答連結', peer.form.getPublishedUrl()],
    ['備註', '請將 viewform 連結貼入 modules/games/links.html']
  ]);
  sh.autoResizeColumns(1, 2);
}
