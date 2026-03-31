let workTime = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 15 * 60;

let time = workTime;
let interval = null;

let sessionCount = 0;
let mode = "work"; // work, short, long

const alarm = new Audio("alarm.mp3"); // add sound file to your folder

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  document.getElementById("mode").textContent =
    `Mode: ${mode.toUpperCase()}`;

  document.getElementById("sessions").textContent =
    `Sessions: ${sessionCount}`;
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
      startTimer(); // auto-start next session
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
  sessionCount = 0;

  updateDisplay();
}

function switchMode() {
  if (mode === "work") {
    sessionCount++;

    if (sessionCount % 4 === 0) {
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

  updateDisplay();
}

updateDisplay();
