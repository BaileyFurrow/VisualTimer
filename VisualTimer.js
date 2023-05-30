// This web application contains Alarm clock (Simple) that is licensed under a Creative Commons Attribution license.
// Source: https://directory.audio/sound-effects/alarms/23085-alarm-clock-simple
// Author: freesman

const TAU = Math.PI * 2;
let cnvWidth = 2160;
let cnvHeight = 2160;
const alarm = new Audio('https://directory.audio/media/fc_local_media/audio_preview/alarm-clock-going-off.mp3');
let fs = document.getElementById('fs');

// Set canvas size and get context

const cnv = document.getElementById('timer');
cnv.setAttribute('width', cnvWidth);
cnv.setAttribute('height', cnvHeight);
const ctx = cnv.getContext('2d');

let timeText = document.getElementById('timeText');
  
let center = {
  x: cnvWidth / 2,
  y: cnvHeight / 2
};

let colors = {
  background: '#ddd',
  foreground: 'blue'
};

document.getElementById('foreground-color').addEventListener('input', e => colors.foreground = e.target.value);
document.getElementById('background-color').addEventListener('input', e => colors.background = e.target.value);

let interval;
let wakeLock = null;

// Rotate so angle origin is at the top
ctx.translate(center.x, center.y);
ctx.rotate(Math.PI * 1.5);
ctx.translate(-center.x, -center.y);

function drawClock(angle) {
  
  // Draw background circle

  ctx.fillStyle = colors.background;
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    center.x,
    center.y,
    Math.min(cnvWidth, cnvHeight) / 2,
    0,
    TAU
  );
  ctx.fill();
  ctx.stroke();

  // Draw circle for visual timer
  
  ctx.fillStyle = colors.foreground;
  ctx.beginPath();
  ctx.arc(
    center.x,
    center.y,
    Math.min(cnvWidth, cnvHeight) / 2,
    0,
    angle
  );
  ctx.lineTo(center.x, center.y);
  ctx.fill();
  ctx.stroke();

}

drawClock(TAU);

function clear(event) {
  let form = document.forms.timerForm;
  form.elements['minutes'].disabled = false;
  form.elements['seconds'].disabled = false;
  document.getElementById('startTimer').innerText = 'Start';
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  clearInterval(interval);
  alarm.pause();
  alarm.load();
  drawClock(0);
  if (event) event.preventDefault();
}

function timerEnd() {
  clearInterval(interval);
  drawClock(0);
  alarm.play();
}

function startTimer(event) {
  clear();
  let form = document.forms.timerForm;
  form.elements['minutes'].disabled = true;
  form.elements['seconds'].disabled = true;
  document.getElementById('startTimer').innerText = 'Restart';
  let minutes = Number(form.elements['minutes'].value);
  let seconds = Number(form.elements['seconds'].value);
 
  let start = new Date(Date.now());
  let end = new Date(start);
  end.setMinutes(start.getMinutes() + minutes, start.getSeconds() + seconds);
  let total = end - start;
  
  drawClock(TAU);
  isTimerRunning = true;
 
  interval = setInterval(() => {
    let delta = end - Date.now();
    if (delta < 0) {
      timerEnd();
      return;
    }
    let secondsLeft = Math.floor(delta / 1000);
    timeText.innerText = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;
    drawClock(TAU * delta / total);
  }, 100);
 
  event.preventDefault();
}

async function fullscreen(event) {
  fs.requestFullscreen();
  wakeLock = await navigator.wakeLock.request('screen');
  event.preventDefault();
}

function exitFullscreen(event) {
  document.exitFullscreen();
  wakeLock.release().then(() => wakeLock = null);
  event.preventDefault();
}

document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('clear').addEventListener('click', clear);
document.getElementById('fullscreen').addEventListener('click', fullscreen);
document.getElementById('exitFS').addEventListener('click', exitFullscreen);

// DEBUG

document.getElementById('color1').addEventListener('input', event => {
  let original = event.target.value;
  let r = parseInt(original.substring(1,3), 16);
  let g = parseInt(original.substring(3,5), 16);
  let b = parseInt(original.substring(5), 16);
  let invert = {
    r: 255 - r,
    g: 255 - g,
    b: 255 - b
  };
  let out = '#';
  out += invert.r.toString(16).padStart(2, '0');
  out += invert.g.toString(16).padStart(2, '0');
  out += invert.b.toString(16).padStart(2, '0');
  document.getElementById('color2').value = out;
});