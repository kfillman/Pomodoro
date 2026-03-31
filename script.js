let workTime = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 15 * 60;

let time = workTime;
let interval = null;
let mode = "work";

// TOTAL counters
let workCount = 0;
let shortCount = 0;
let longCount = 0;

// SESSION counters (reset after long break)
let sessionWork = 0;
let sessionShort = 0;
let sessionLong = 0;

const alarm = new Audio("alarm.mp3");

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

  // Session stats
  document.getElementById("sessionWork").textContent = sessionWork;
  document.getElementById("sessionShort").textContent = sessionShort;
  document.getElementById("sessionLong").textContent = sessionLong;
}

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

  // Reset ALL stats
  workCount = 0;
  shortCount = 0;
  longCount = 0;

  sessionWork = 0;
  sessionShort = 0;
  sessionLong = 0;

  document.getElementById("modeSelect").value = "work";

  updateDisplay();
}

function changeMode(selectedMode) {
  clearInterval(interval);
  interval = null;

  mode = selectedMode;

  if (mode === "work") time = workTime;
  if (mode === "short") time = shortBreak;
  if (mode === "long") time = longBreak;

  updateActiveButton();
  updateDisplay();
}

function updateActiveButton() {
  document.getElementById("workBtn").classList.remove("active");
  document.getElementById("shortBtn").classList.remove("active");
  document.getElementById("longBtn").classList.remove("active");

  if (mode === "work") {
    document.getElementById("workBtn").classList.add("active");
  } else if (mode === "short") {
    document.getElementById("shortBtn").classList.add("active");
  } else {
    document.getElementById("longBtn").classList.add("active");
  }
}

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

    // 🔥 Reset session stats after long break
    sessionWork = 0;
    sessionShort = 0;
    sessionLong = 0;
  }
}

function switchMode() {
  if (mode === "work") {
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

  document.getElementById("modeSelect").value = mode;
  updateDisplay();
}

function nextTimer() {
  clearInterval(interval);
  interval = null;

  // Play alarm
  alarm.play();

  // Update counts as if the timer finished
  handleCounts();

  // Switch to the next mode
  switchMode();

  // Auto-start next timer if you want, otherwise leave paused
  startTimer();
}

updateDisplay();
