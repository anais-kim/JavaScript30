const player = document.querySelector('.player');
const video = player.querySelector('video');
const playButton = player.querySelector('.toggle');
const sliders = player.querySelectorAll('.player__slider');
const skipButtons = player.querySelectorAll('[data-skip]');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const fullscreenButton = player.querySelector('.fullscreen');

async function playVideo() {
    try {
        await video.play();
    } catch (error) {
        console.error(error);
    }
}

function togglePlay() {
    if (video.paused) playVideo();
    else video.pause();
}

function updatePlayButton() {
    playButton.textContent = (video.paused)? '►' : '❚ ❚';
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function skip() {
    video.currentTime += parseInt(this.dataset.skip);
}

function fillProgressBar() {
    const progressPercent = video.currentTime / video.duration * 100
    progressBar.style.flexBasis = `${progressPercent}%`;
}

function updateProgress(e) {
    video.currentTime = e.offsetX / progress.offsetWidth * video.duration;
}

function handleFullscreen() {
    if (document.fullscreenElement === player) document.exitFullscreen();
    else player.requestFullscreen();
}

function updateFullscreenButton() {
    fullscreenButton.innerHTML = document.fullscreenElement === player? 
        '<i class="icon-resize-small"></i>' : 
        '<i class="icon-fullscreen"></i>';
}

function updateVideoToFullscreen() {
    player.style.border = document.fullscreenElement === player? 0 : '';
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('timeupdate', fillProgressBar);

playButton.addEventListener('click', togglePlay);

sliders.forEach(slider => {
    slider.addEventListener('change', handleRangeUpdate);
    slider.addEventListener('mousemove', handleRangeUpdate);
});

skipButtons.forEach(button => button.addEventListener('click', skip));

let mousedown;
progress.addEventListener('click', updateProgress);
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mousemove', (e) => mousedown && updateProgress(e));

fullscreenButton.addEventListener('click', handleFullscreen);
player.addEventListener('fullscreenchange', updateFullscreenButton);
player.addEventListener('fullscreenchange', updateVideoToFullscreen);