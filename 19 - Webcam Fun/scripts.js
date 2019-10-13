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

function redFilter(pixels) {
    for (let i = 0; i <= pixels.data.length; i+=4) {
        pixels.data[i+1] = 0;
        pixels.data[i+2] = 0;
    }
}

function rgbSplit(pixels) {
    for (let i = 0; i <= pixels.data.length; i+=4) {
        pixels.data[i] = pixels.data[i+100];
        pixels.data[i+1] = pixels.data[i+1+400];
        pixels.data[i+2] = pixels.data[i+2+700];
    }
}

function greenScreen({data: rgb}) {
    const ranges = [...greenControls.querySelectorAll('input[type=range]')];
    const {rmin, rmax, gmin, gmax, bmin, bmax} = ranges.reduce((totalRange, range) => {
        if (!totalRange[range.name]) totalRange[range.name] = range.value;
        return totalRange;
    }, {});

    for (let i = 0; i < rgb.length; i+=4) {
        const r = rgb[i];
        const g = rgb[i+1];
        const b = rgb[i+2];

        if (r >= rmin && r <= rmax && g >= gmin && g <= gmax && b >= bmin && b <= bmax) {
            rgb[i] = 255;
            rgb[i+1] = 255;
            rgb[i+2] = 255;
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
                redFilter(pixels);
                break;
            case 'rgb':
                rgbSplit(pixels);
                break;
            case 'green':
                greenScreen(pixels);
                break;
            case 'none':
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
