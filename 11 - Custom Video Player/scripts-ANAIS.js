const player = document.querySelector('.player');
const video = player.querySelector('video');
const toggle = player.querySelector('.toggle');
const sliders = player.querySelectorAll('.player__slider');
const skipButtons = player.querySelectorAll('[data-skip]');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

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

function updateButton() {
    toggle.textContent = (video.paused)? '►' : '❚ ❚';
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

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', fillProgressBar);

toggle.addEventListener('click', togglePlay);

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
