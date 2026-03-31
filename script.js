// --------------------- TIMER SETTINGS ---------------------
let workTime = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 15 * 60;

let time = workTime;
let interval = null;
let mode = "work"; // current mode

// --------------------- SESSION SEQUENCE ---------------------
// Standard Pomodoro cycle: work, short, work, short, work, long
const pomodoroSequence = ["work", "short", "work", "short", "work", "long"];
let sessionIndex = 0; // track position in sequence

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
  
  document.getElementById("mode").textContent = `Mode: ${mode.toUpperCase()}`;
  
  // Update Next Mode indicator
  document.getElementById("nextMode").textContent = `Next: ${pomodoroSequence[(sessionIndex + 1) % pomodoroSequence.length].toUpperCase()}`;

  // Total stats
  document.getElementById("workCount").textContent = workCount;
  document.getElementById("shortCount").textContent = shortCount;
  document.getElementById("longCount").textContent = longCount;

  // This session stats
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
      nextSession();
      startTimer(); // auto-start next
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

  // reset stats
  workCount = shortCount = longCount = 0;
  sessionWork = sessionShort = sessionLong = 0;

  updateActiveButton(); // highlight initial mode
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

// --------------------- MODE BUTTONS ---------------------
function changeMode(selectedMode) {
  clearInterval(interval);
  interval = null;

  mode = selectedMode;
  time = getTimeForMode(mode);

  // Update sessionIndex to match selected mode
  sessionIndex = pomodoroSequence.findIndex(m => m === mode);

  updateActiveButton(); // highlight selected mode
  updateDisplay();
}

function updateActiveButton() {
  // Remove active class from all buttons
  document.getElementById("workBtn").classList.remove("active");
  document.getElementById("shortBtn").classList.remove("active");
  document.getElementById("longBtn").classList.remove("active");

  // Add active class to the button that matches the current mode
  if (mode === "work") document.getElementById("workBtn").classList.add("active");
  else if (mode === "short") document.getElementById("shortBtn").classList.add("active");
  else if (mode === "long") document.getElementById("longBtn").classList.add("active");
}

// --------------------- COUNTS ---------------------
function handleCounts() {
  if (mode === "work") { workCount++; sessionWork++; }
  else if (mode === "short") { shortCount++; sessionShort++; }
  else { 
    longCount++; sessionLong++;
    // Reset this session stats after long break
    sessionWork = sessionShort = sessionLong = 0;
  }
}

// --------------------- SESSION LOGIC ---------------------
function nextSession() {
  sessionIndex = (sessionIndex + 1) % pomodoroSequence.length;
  mode = pomodoroSequence[sessionIndex];
  time = getTimeForMode(mode);

  updateActiveButton(); // highlight current mode button
  updateDisplay();
}

function getTimeForMode(mode) {
  if (mode === "work") return workTime;
  if (mode === "short") return shortBreak;
  if (mode === "long") return longBreak;
}

// --------------------- INITIALIZE ---------------------
updateActiveButton();
updateDisplay();
