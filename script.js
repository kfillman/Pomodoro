// --------------------- TIMER SETTINGS ---------------------
let workTime = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 15 * 60;

let time = workTime;
let interval = null;
let mode = "work";

// --------------------- STATS ---------------------
let workCount = 0, shortCount = 0, longCount = 0;
let sessionWork = 0, sessionShort = 0, sessionLong = 0;

// --------------------- AUDIO ---------------------
const alarm = new Audio("alarm.mp3");

// --------------------- UPDATE DISPLAY ---------------------
function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

  document.getElementById("mode").textContent =
    `Mode: ${mode.toUpperCase()}`;

  document.getElementById("workCount").textContent = workCount;
  document.getElementById("shortCount").textContent = shortCount;
  document.getElementById("longCount").textContent = longCount;

  document.getElementById("sessionWork").textContent = sessionWork;
  document.getElementById("sessionShort").textContent = sessionShort;
  document.getElementById("sessionLong").textContent = sessionLong;
}

// --------------------- TIMER CONTROLS ---------------------
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
      switchMode();
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

  mode = "work";
  time = workTime;

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
  switchMode();
  startTimer();
}

// --------------------- MODE BUTTONS ---------------------
function changeMode(selectedMode) {
  clearInterval(interval);
  interval = null;

  mode = selectedMode;

  if (mode === "work") time = workTime;
  else if (mode === "short") time = shortBreak;
  else if (mode === "long") time = longBreak;

  updateActiveButton();
  updateDisplay();
}

function updateActiveButton() {
  document.getElementById("workBtn").classList.remove("active");
  document.getElementById("shortBtn").classList.remove("active");
  document.getElementById("longBtn").classList.remove("active");

  if (mode === "work") document.getElementById("workBtn").classList.add("active");
  else if (mode === "short") document.getElementById("shortBtn").classList.add("active");
  else if (mode === "long") document.getElementById("longBtn").classList.add("active");
}

// --------------------- COUNTS & SWITCH ---------------------
function handleCounts() {
  if (mode === "work") { workCount++; sessionWork++; }
  else if (mode === "short") { shortCount++; sessionShort++; }
  else { 
    longCount++; sessionLong++; 
    sessionWork = sessionShort = sessionLong = 0; // reset session stats
  }
}

function switchMode() {
  if (mode === "work") {
    if (workCount % 4 === 0) { mode = "long"; time = longBreak; }
    else { mode = "short"; time = shortBreak; }
  } else {
    mode = "work"; time = workTime;
  }

  updateActiveButton();
  updateDisplay();
}

// --------------------- INITIALIZE ---------------------
updateActiveButton();
updateDisplay();
