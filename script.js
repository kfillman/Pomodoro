// --------------------- TIMER SETTINGS ---------------------
let workTime = 25 * 60;      // 25 minutes
let shortBreak = 5 * 60;     // 5 minutes
let longBreak = 15 * 60;     // 15 minutes

let time = workTime;          // Current timer
let interval = null;
let mode = "work";            // Current mode: "work", "short", "long"

// --------------------- STATS ---------------------
// Total stats (never reset unless reset button)
let workCount = 0;
let shortCount = 0;
let longCount = 0;

// This session stats (reset after long break)
let sessionWork = 0;
let sessionShort = 0;
let sessionLong = 0;

// --------------------- AUDIO ---------------------
const alarm = new Audio("alarm.mp3"); // place alarm.mp3 in same folder

// --------------------- UPDATE DISPLAY ---------------------
function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  document.getElementById("mode").textContent =
    `Mode: ${mode.toUpperCase()}`;

  // Total stats
  document.getElementById("workCount").textContent = workCount;
  document.getElementById("shortCount").textContent = shortCount;
  document.getElementById("longCount").textContent = longCount;

  // This session stats
  document.getElementById("sessionWork").textContent = sessionWork;
  document.getElementById("sessionShort").textContent = sessionShort;
  document.getElementById("sessionLong").textContent = sessionLong;
}

// --------------------- START TIMER ---------------------
function startTimer() {
  if (interval) return; // Already running

  interval = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      // Time's up
      clearInterval(interval);
      interval = null;

      alarm.play();
      handleCounts();   // update stats
      switchMode();     // move to next session
      startTimer();     // auto-start next timer
    }
  }, 1000);
}

// --------------------- PAUSE TIMER ---------------------
function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

// --------------------- RESET TIMER ---------------------
function resetTimer() {
  clearInterval(interval);
  interval = null;

  mode = "work";
  time = workTime;

  // Reset all stats
  workCount = 0;
  shortCount = 0;
  longCount = 0;

  sessionWork = 0;
  sessionShort = 0;
  sessionLong = 0;

  updateActiveButton();
  updateDisplay();
}

// --------------------- NEXT TIMER ---------------------
function nextTimer() {
  clearInterval(interval);
  interval = null;

  alarm.play();        // play alarm
  handleCounts();      // count as completed
  switchMode();        // switch to next mode
  startTimer();        // auto-start next
}

// --------------------- MODE BUTTONS ---------------------
function changeMode(selectedMode) {
  clearInterval(interval);
  interval = null;

  mode = selectedMode;

  // Set timer for the selected mode
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

// --------------------- HANDLE COUNTS ---------------------
function handleCounts() {
  if (mode === "work") {
    workCount++;
    sessionWork++;
  } else if (mode === "short") {
    shortCount++;
    sessionShort++;
  } else if (mode === "long") {
    longCount++;
    sessionLong++;

    // Reset this session stats after long break
    sessionWork = 0;
    sessionShort = 0;
    sessionLong = 0;
  }
}

// --------------------- SWITCH MODE ---------------------
function switchMode() {
  if (mode === "work") {
    // Every 4th work session triggers long break
    if (workCount % 4 === 0) {
      mode = "long";
      time = longBreak;
    } else {
      mode = "short";
      time = shortBreak;
    }
  } else {
    mode = "work";
    time = workTime;
  }

  updateActiveButton();
  updateDisplay();
}

// --------------------- INITIALIZE ---------------------
updateActiveButton();
updateDisplay();
