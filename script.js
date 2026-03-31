// TIMER SETTINGS
let workTime = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 15 * 60;

let time = workTime;
let interval = null;
let mode = "work";

const pomodoroSequence = ["work", "short", "work", "short", "work", "long"];
let sessionIndex = 0;

let workCount = 0, shortCount = 0, longCount = 0;
let sessionWork = 0, sessionShort = 0, sessionLong = 0;

const alarm = new Audio("alarm.mp3");
const sessionLabels = ["Work", "Short Break", "Work", "Short Break", "Work", "Long Break"];

const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
  const offset = circumference - percent * circumference;
  circle.style.strokeDashoffset = offset;
}

// UPDATE SESSION LIST
function updateSessionList() {
  const list = document.getElementById("sessionList");
  list.innerHTML = "";
  for (let i = 0; i < pomodoroSequence.length; i++) {
    const li = document.createElement("li");
    const done = i < sessionIndex;
    li.textContent = `${sessionLabels[i]} ${done ? "✅" : "❌"}`;
    list.appendChild(li);
  }
}

// UPDATE DISPLAY
function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  document.getElementById("mode").textContent = `Mode: ${mode.toUpperCase()}`;

  const nextIndex = (sessionIndex + 1) % pomodoroSequence.length;
  document.getElementById("nextMode").textContent = `Next: ${pomodoroSequence[nextIndex].toUpperCase()}`;

  document.getElementById("workCount").textContent = workCount;
  document.getElementById("shortCount").textContent = shortCount;
  document.getElementById("longCount").textContent = longCount;

  updateSessionList();

  // BACKGROUND COLOR
  if (mode === "short") document.body.style.background = "#ffe4ec";
  else if (mode === "long") document.body.style.background = "#e6e0ff";
  else document.body.style.background = "#fff5e6";

  // CIRCLE PROGRESS
  const totalTime = getTimeForMode(mode);
  setProgress(time / totalTime);
}

// TIMER CONTROLS
function startTimer() {
  if (interval) return;
  interval = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;
      alarm.play();
      handleCounts();
      nextSession();
      startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  sessionIndex = 0;
  mode = pomodoroSequence[sessionIndex];
  time = getTimeForMode(mode);
  workCount = shortCount = longCount = 0;
  sessionWork = sessionShort = sessionLong = 0;
  updateActiveButton();
  updateDisplay();
}

function nextTimer() {
  clearInterval(interval);
  interval = null;
  alarm.play();
  handleCounts();
  nextSession();
  startTimer();
}

// MODE BUTTONS
function changeMode(selectedMode) {
  clearInterval(interval);
  interval = null;
  mode = selectedMode;
  time = getTimeForMode(mode);
  sessionIndex = pomodoroSequence.findIndex(m => m === mode);
  updateActiveButton();
  updateDisplay();
}

function updateActiveButton() {
  document.getElementById("workBtn").classList.remove("active");
  document.getElementById("shortBtn").classList.remove("active");
  document.getElementById("longBtn").classList.remove("active");
  if (mode === "work") document.getElementById("workBtn").classList.add("active");
  else if (mode === "short") document.getElementById("shortBtn").classList.add("active");
  else document.getElementById("longBtn").classList.add("active");
}

// COUNTS
function handleCounts() {
  if (mode === "work") { workCount++; sessionWork++; }
  else if (mode === "short") { shortCount++; sessionShort++; }
  else { longCount++; sessionLong++; sessionWork=0; sessionShort=0; sessionLong=0; }
}

// SESSION LOGIC
function nextSession() {
  sessionIndex = (sessionIndex + 1) % pomodoroSequence.length;
  mode = pomodoroSequence[sessionIndex];
  time = getTimeForMode(mode);
  updateActiveButton();
  updateDisplay();
}

function getTimeForMode(mode) {
  if (mode === "work") return workTime;
  if (mode === "short") return shortBreak;
  if (mode === "long") return longBreak;
}

// INITIALIZE
updateActiveButton();
updateDisplay();
