// TIMER SETTINGS
let workTime = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 15 * 60;

let time = workTime;
let interval = null;
let mode = "work";

// POMODORO SEQUENCE
const pomodoroSequence = ["work", "short", "work", "short", "work", "long"];
let sessionIndex = 0;

// STATS
let workCount = 0, shortCount = 0, longCount = 0;

// SESSION TRACKER
const sessionLabels = ["Work", "Short Break", "Work", "Short Break", "Work", "Long Break"];
let completedSessions = Array(pomodoroSequence.length).fill(false);

// AUDIO
const alarm = new Audio("alarm.mp3");

// CIRCLE
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
  for (let i = 0; i < sessionLabels.length; i++) {
    const li = document.createElement("li");
    li.textContent = `${sessionLabels[i]} ${completedSessions[i] ? "✅" : "❌"}`;
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

  updateActiveButton();
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
      completeCurrentSession();
      nextSession();
      startTimer(); // auto start next session
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
  completedSessions = Array(pomodoroSequence.length).fill(false);
  updateDisplay();
}

function nextTimer() {
  clearInterval(interval);
  interval = null;
  alarm.play();
  completeCurrentSession();
  nextSession();
  startTimer(); // auto-start next
}

// MODE BUTTONS
function changeMode(selectedMode) {
  clearInterval(interval);
  interval = null;
  mode = selectedMode;
  time = getTimeForMode(mode);
  sessionIndex = pomodoroSequence.findIndex(m => m === mode);
  updateDisplay();
}

// ACTIVE BUTTON HIGHLIGHT
function updateActiveButton() {
  document.getElementById("workBtn").classList.remove("active");
  document.getElementById("shortBtn").classList.remove("active");
  document.getElementById("longBtn").classList.remove("active");
  if (mode === "work") document.getElementById("workBtn").classList.add("active");
  else if (mode === "short") document.getElementById("shortBtn").classList.add("active");
  else if (mode === "long") document.getElementById("longBtn").classList.add("active");
}

// SESSION LOGIC
function completeCurrentSession() {
  completedSessions[sessionIndex] = true;
  if (mode === "work") workCount++;
  else if (mode === "short") shortCount++;
  else longCount++;
  // Reset after long break
  if (mode === "long") completedSessions = Array(pomodoroSequence.length).fill(false);
}

function nextSession() {
  sessionIndex = (sessionIndex + 1) % pomodoroSequence.length;
  mode = pomodoroSequence[sessionIndex];
  time = getTimeForMode(mode);
  updateDisplay();
}

function getTimeForMode(mode) {
  if (mode === "work") return workTime;
  if (mode === "short") return shortBreak;
  if (mode === "long") return longBreak;
  return workTime;
}

// INITIALIZE
updateDisplay();
