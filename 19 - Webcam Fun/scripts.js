const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const effectControls = document.querySelectorAll('.effect-controls input');
const greenControls = document.querySelector('.green-controls');

let effect = 'none';

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(error => {
        console.error(error);
    });
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const photo = {
        url: canvas.toDataURL('image/jpeg', 0.8),
        title: 'my_photo', 
    };

    const link = document.createElement('a');
    link.href = photo.url;
    link.setAttribute('download', photo.title);

    const image = document.createElement('img');
    image.src = photo.url;
    image.alt = photo.title;
    link.appendChild(image);

    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i <= pixels.data.length; i+=4) {
        pixels.data[i+1] = 0;
        pixels.data[i+2] = 0;
    }
}

function rgbSplit(pixels) {
    for (let i = 0; i <= pixels.data.length; i+=4) {
        pixels.data[i-100] = pixels.data[i];
        pixels.data[i+200] = pixels.data[i+1];
        pixels.data[i-202] = pixels.data[i+2];
    }
}

function greenScreen({data: rgb}) {
    const range = {};
    greenControls.querySelectorAll('input[type=range]').forEach(input => {
        range[input.name] = input.value;
    });

    for (let i = 0; i < rgb.length; i+=4) {
        const r = rgb[i];
        const g = rgb[i+1];
        const b = rgb[i+2];

        if (r >= range.rmin 
         && r <= range.rmax 
         && g >= range.gmin 
         && g <= range.gmax 
         && b >= range.bmin 
         && b <= range.bmax) {
            rgb[i+3] = 0;
        }
    }
}

function screenVideo() {
    const {videoWidth: width, videoHeight: height} = video;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);

        const pixels  = ctx.getImageData(0, 0, width, height);

        switch (effect) {
            case 'red':
                redEffect(pixels);
                break;
            case 'rgb':
                rgbSplit(pixels);
                break;
            case 'green':
                greenScreen(pixels);
                break;
        }
        ctx.putImageData(pixels, 0, 0);
    }, 20);
}

function handleEffectControls() {
    effect = this.value;

    greenControls.style.display = (effect === 'green')? 'block' : 'none';
}

getVideo();

video.addEventListener('canplay', screenVideo);
effectControls.forEach(control => {
    control.addEventListener('click', handleEffectControls);
});
