let STUDENTS = [];
let TEAMS = [];

function importCSVFromInput(inputId = "fileInput") {
  const file = document.getElementById(inputId).files[0];
  if (!file) {
    alert("請先選擇 CSV 檔案");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const text = e.target.result.trim();
    const rows = text.split(/\r?\n/).slice(1);
    const teamMap = {};

    STUDENTS = [];

    rows.forEach(row => {
      const cols = row.split(",");
      const semester = cols[0]?.trim();
      const student_id = cols[1]?.trim();
      const name = cols[2]?.trim();
      const team_name = cols[3]?.trim();

      if (!student_id || !name) return;

      const student = {
        semester,
        student_id,
        name,
        team_name
      };

      STUDENTS.push(student);

      if (!teamMap[team_name]) {
        teamMap[team_name] = {
          team_name,
          members: []
        };
      }

      teamMap[team_name].members.push(student);
    });

    TEAMS = Object.values(teamMap);

    localStorage.setItem("STUDENTS", JSON.stringify(STUDENTS));
    localStorage.setItem("TEAMS", JSON.stringify(TEAMS));

    alert("名單匯入成功！");
    location.reload();
  };

  reader.readAsText(file, "utf-8");
}

function loadStudents() {
  STUDENTS = JSON.parse(localStorage.getItem("STUDENTS") || "[]");
  TEAMS = JSON.parse(localStorage.getItem("TEAMS") || "[]");
}