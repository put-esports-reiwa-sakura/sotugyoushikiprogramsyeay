const audio1 = document.querySelector('#audio1');
const audio2 = document.querySelector('#audio2');
const playPauseBtn = document.querySelector('#playPauseBtn');
const timeDisplay = document.querySelector('#timeDisplay');
const youtubeScrubber = document.querySelector('#youtubeScrubber');
let isPlaying = false;

playPauseBtn.addEventListener('click', function() {
  if (isPlaying) {
    audio1.pause();
    audio2.pause();
    isPlaying = false;
    playPauseBtn.textContent = '再生';
  } else {
    audio1.play();
    audio2.play();
    isPlaying = true;
    playPauseBtn.textContent = '一時停止';
  }
});

document.querySelectorAll('.vertical-slider').forEach(function(slider, index) {
  const sliderBar = slider.querySelector('.slider-bar');
  const sliderKnob = slider.querySelector('.slider-knob');
  const audio = index === 0 ? audio1 : audio2;
  let isDragging = false;

  function updateValue(y) {
    const sliderHeight = slider.clientHeight;
    const sliderTop = slider.getBoundingClientRect().top + window.scrollY;
    const newValue = 100 - ((y - sliderTop) / sliderHeight) * 100;
    const clampedValue = Math.max(0, Math.min(100, newValue));
    sliderKnob.style.bottom = clampedValue + '%';
    changeVolume(clampedValue);
  }

  function handleMouseDownOrTouchStart(e) {
    isDragging = true;
    if (e.type === 'mousedown') {
      updateValue(e.clientY);
    } else if (e.type === 'touchstart') {
      updateValue(e.touches[0].clientY);
    }
  }

  function handleMouseMoveOrTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling on touch devices
    if (e.type === 'mousemove') {
      updateValue(e.clientY);
    } else if (e.type === 'touchmove') {
      updateValue(e.touches[0].clientY);
    }
  }

  function handleMouseUpOrTouchEnd() {
    isDragging = false;
  }

  sliderKnob.addEventListener('mousedown', handleMouseDownOrTouchStart);
  sliderKnob.addEventListener('touchstart', handleMouseDownOrTouchStart);
  document.addEventListener('mousemove', handleMouseMoveOrTouchMove);
  document.addEventListener('touchmove', handleMouseMoveOrTouchMove);
  document.addEventListener('mouseup', handleMouseUpOrTouchEnd);
  document.addEventListener('touchend', handleMouseUpOrTouchEnd);

  function changeVolume(value) {
    audio.volume = value / 100;
  }
});

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

audio1.addEventListener('timeupdate', function() {
  const currentTime = audio1.currentTime;
  const duration = audio1.duration;
  timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  youtubeScrubber.value = (currentTime / duration) * 100;
});

audio2.addEventListener('timeupdate', function() {
  const currentTime = audio2.currentTime;
  const duration = audio2.duration;
  timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  youtubeScrubber.value = (currentTime / duration) * 100;
});

youtubeScrubber.addEventListener('input', function() {
  const newPosition = youtubeScrubber.value * audio1.duration / 100;
  audio1.currentTime = newPosition;
  audio2.currentTime = newPosition;
});
