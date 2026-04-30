let SCORE_LOG = [];

function loadScores() {
  SCORE_LOG = JSON.parse(localStorage.getItem("SCORE_LOG") || "[]");
}

function saveScores() {
  localStorage.setItem("SCORE_LOG", JSON.stringify(SCORE_LOG));
}

function addScore(record) {
  SCORE_LOG.push({
    ...record,
    time: new Date().toISOString()
  });

  saveScores();
}

function getTeamScores() {
  const result = {};

  SCORE_LOG.forEach(r => {
    if (!result[r.team_name]) result[r.team_name] = 0;
    result[r.team_name] += Number(r.team_score || 0);
  });

  return result;
}

function getIndividualScores() {
  const result = {};

  SCORE_LOG.forEach(r => {
    if (!result[r.student_id]) {
      result[r.student_id] = {
        student_id: r.student_id,
        name: r.student_name,
        team_name: r.team_name,
        score: 0
      };
    }

    result[r.student_id].score += Number(r.individual_score || 0);
  });

  return Object.values(result);
}

function exportScoresCSV() {
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

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "scores.csv";
  a.click();
}

function resetScores() {
  if (confirm("確定要清除所有成績？")) {
    localStorage.removeItem("SCORE_LOG");
    location.reload();
  }
}