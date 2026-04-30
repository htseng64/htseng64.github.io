function exportScoresCSV() {
  const SCORE_LOG = JSON.parse(localStorage.getItem("SCORE_LOG") || "[]");

  let csv = "學期,學號,姓名,組別,遊戲,單元,題目,個人成績,團體成績,是否答對,時間\n";

  SCORE_LOG.forEach(r => {
    csv += [
      r.semester,
      r.student_id,
      r.student_name,
      r.team_name,
      r.game_name,
      r.unit_name,
      r.question,
      r.individual_score,
      r.team_score,
      r.correct,
      r.time
    ].join(",") + "\n";
  });

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "scores.csv";
  a.click();
}