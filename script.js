let workTime = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 15 * 60;

let time = workTime;
let interval = null;

let mode = "work";

// Counters
let workCount = 0;
let shortCount = 0;
let longCount = 0;

const alarm = new Audio("alarm.mp3");

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  document.getElementById("mode").textContent =
    `Mode: ${mode.toUpperCase()}`;

  document.getElementById("workCount").textContent = workCount;
  document.getElementById("shortCount").textContent = shortCount;
  document.getElementById("longCount").textContent = longCount;
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

  workCount = 0;
  shortCount = 0;
  longCount = 0;

  updateDisplay();
}

function switchMode() {
  if (mode === "work") {
    workCount++;

    if (workCount % 4 === 0) {
      mode = "long";
      longCount++;
      time = longBreak;
    } else {
      mode = "short";
      shortCount++;
      time = shortBreak;
    }
  } else {
    mode = "work";
    time = workTime;
  }

  updateDisplay();
}

updateDisplay();
