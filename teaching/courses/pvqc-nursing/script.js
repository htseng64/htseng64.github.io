// 📖 THE WORD POOL
const wordPool = [
    { hint: "Heart rate > 100 bpm", answer: "tachycardia" },
    { hint: "Heart rate < 60 bpm", answer: "bradycardia" },
    { hint: "High blood pressure", answer: "hypertension" },
    { hint: "Difficulty breathing", answer: "dyspnea" }
];

let currentStage = 1; 
let currentIndex = 0;
let xp = 0;

// Initialize Game
document.getElementById('student-id').addEventListener('change', function() {
    if(this.value) showQuestion();
});

function showQuestion() {
    const q = wordPool[currentIndex];
    document.getElementById('clinical-hint').innerText = q.hint;
    document.getElementById('feedback').innerText = "";
    
    if (currentStage === 1) {
        setupStage1(q);
    } else {
        setupStage2();
    }
}

function setupStage1(q) {
    const area = document.getElementById('choice-area');
    area.innerHTML = "";
    area.classList.remove('hidden');
    document.getElementById('spelling-area').classList.add('hidden');

    let options = [q.answer, "hypotension", "apnea", "cyanosis"];
    options = options.sort(() => Math.random() - 0.5);

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkStage1(opt, q.answer);
        area.appendChild(btn);
    });
}

function checkStage1(selected, correct) {
    if (selected === correct) {
        xp += 50;
        document.getElementById('xp-display').innerText = `XP: ${xp}`;
        advance();
    } else {
        document.getElementById('feedback').innerText = "❌ WRONG CHOICE";
        document.getElementById('feedback').style.color = "red";
    }
}

function setupStage2() {
    document.getElementById('choice-area').classList.add('hidden');
    document.getElementById('spelling-area').classList.remove('hidden');
    document.getElementById('user-answer').value = "";
    document.getElementById('user-answer').focus();
}

function processAnswer() {
    const input = document.getElementById('user-answer').value.toLowerCase().trim();
    if (input === wordPool[currentIndex].answer) {
        xp += 100;
        document.getElementById('xp-display').innerText = `XP: ${xp}`;
        advance();
    } else {
        document.getElementById('feedback').innerText = "❌ SPELLING ERROR!";
        document.getElementById('feedback').style.color = "red";
    }
}

function advance() {
    currentIndex++;
    if (currentIndex >= wordPool.length) {
        if (currentStage === 1) {
            currentStage = 2;
            currentIndex = 0;
            document.getElementById('stage-banner').className = "stage-testing";
            document.getElementById('stage-text').innerText = "STAGE 2 - EMERGENCY SPELLING";
            alert("STAGE 1 COMPLETE! ENTERING LOCKDOWN...");
            showQuestion();
        } else {
            document.getElementById('monitor').innerHTML = "<h1>WARD SECURED!</h1>";
        }
    } else {
        showQuestion();
    }
}