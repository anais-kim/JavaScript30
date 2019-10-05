const video = document.querySelector('video');

const playButton = document.querySelector('.player__button, .toggle');
const volumeSlider = document.querySelector('input[name="volume"]');
const playbackRateSlider = document.querySelector('input[name="playbackRate"]');
const skipButtons = document.querySelectorAll('.player__button[data-skip]');
const progressBar = document.querySelector('.progress');
const progressFilled = document.querySelector('.progress__filled');

let isProgressUpdate;

async function playVideo() {
    try {
        await video.play();
    } catch (error) {
        console.error(error);
    }
}

function handlePlay() {
    if (video.paused) playVideo();
    else video.pause();
    
    playButton.innerHTML = (video.paused)? '►' : '❚ ❚';
}

function updateVolume() {
    video.volume = this.value;
}

function updatePlaybackRate() {
    video.playbackRate = this.value;
}

function handleSkip() {
    const skip = parseInt(this.dataset.skip);
    video.currentTime = video.currentTime + skip;
}

function updateProgress() {
    const progress = video.currentTime / video.duration * 100
    progressFilled.style.flexBasis = `${progress}%`;
}

function clickProgress(e) {
    video.currentTime = e.offsetX / this.clientWidth * video.duration;
}

function dragProgress(e) {
    if (!isProgressUpdate) return;
    video.currentTime = e.offsetX / this.clientWidth * video.duration;
}

playButton.addEventListener('click', handlePlay);

volumeSlider.addEventListener('change', updateVolume);
volumeSlider.addEventListener('mousemove', updateVolume);
playbackRateSlider.addEventListener('change', updatePlaybackRate);
playbackRateSlider.addEventListener('mousemove', updatePlaybackRate);

skipButtons.forEach(button => button.addEventListener('click', handleSkip));

video.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('click', clickProgress);
progressBar.addEventListener('mousedown', () => isProgressUpdate = true);
progressBar.addEventListener('mouseup', () => isProgressUpdate = false);
progressBar.addEventListener('mousemove', dragProgress);



    

