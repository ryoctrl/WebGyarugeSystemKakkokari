let playing = false;
let interval;
let displayText = "";
let text = "";
let count = 1;
let strCount = 0;
let cutCount = 0;
let displaying = false;
let textSpeed = 100;

let textEl;
let charaEl;
let serifSelectEl;
let serifPanel;
let namePanel;
let playButton;

const textWidth = 18;
const lineCharacters = textWidth - 1;
const pageMaxCharacters = lineCharacters * 3;


window.addEventListener('load', function() {
    serifSelectEl = document.getElementById('serif-select');
    serifSelectEl.addEventListener('change', loadAndPlay);
    charaEl = document.getElementById('char');
    textEl = document.getElementById('text');
    serifPanel = document.getElementById('serif');
    namePanel = document.getElementById('speaker-name');
    playButton = document.getElementById('playbutton');
    const speedSlider = document.getElementById('speed-slider');
    speedSlider.addEventListener('input', function(e) {
        e = e.target;
        changeTextSpeed(e.value);
    });
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', function(e) {
        e = e.target;
        changeVolume(e.value);
    });
    document.addEventListener('touchmove', function(e) { 
        if(e.target === speedSlider || e.target === volumeSlider) {
            return;
        }
        e.preventDefault();
    }, {passive: false});
});

function loadAndPlay() {
    if(serifSelectEl.value == -1) {
        wa.stop();
        displayMessage(' ', '');
        changeCharacter('/images/yukari.png');
        return;
    }

    const serif = serifs[serifSelectEl.selectedIndex - 1];
    changeImage(serif);
    wa.loadFile('upload/' + serifSelectEl.value, function(buffer){
        playButton.addEventListener('click', function() {
            if(playing) {
                wa.stop();
                playing = false;
            }

            wa.play(buffer);
            displayMessage(speakers[serif.speaker_id - 1].name, serif.text);
            playing = true;
        });
    });
}

function displayMessage(speaker, argtext) {
    initialize();
    displaying = true;
    if(argtext === '') {
        serifPanel.style.display = 'none';
        return;
    }
    namePanel.innerText = speaker;
    text = argtext;
    serifPanel.style.display = 'block';
    interval = setInterval(intervalFunc, textSpeed);
}

function initialize() {
    clearInterval(interval);
    displayText = "";
    text = "";
    count = 1;
    strCount = 0;
    cutCount = 0;
    displaying = false;
}

function intervalFunc() {
    displayText = text.substr(0, count);
    count++;
    strCount++;
    if(strCount >= pageMaxCharacters) {
        cutCount++;
        strCount -= textWidth;
    }
    displayText = displayText.substr(lineCharacters * cutCount, displayText.count);
    updateText(displayText);
    if(count == text.length) {
        clearInterval(interval);
        setTimeout(completeDisplay(text), textSpeed);
    }
}

function updateText(text) {
    textEl.innerText = text;
}

function changeTextSpeed(value) {
    document.getElementById('speed-val').innerHTML = value;
    textSpeed = value == 0 ? 0 : 1000 / value;
    if(displaying) {
        clearInterval(interval);
        if(textSpeed === 0) return;
        interval = setInterval(intervalFunc, textSpeed);
    }
}

function changeVolume(value) {
    document.getElementById('volume-val').innerHTML = value;
    wa.changeVolume(value);
}

function completeDisplay(text) {
    textEl.innerText = text;
    textEl.scrollBy(0, 1000);
    initialize();
}

function changeCharacter(url) {
    if(!url) return;
    charaEl.style.backgroundImage = `url("${url}")`;
}

function changeImage(serif) {
    if(!serif.picture_id) return;
    changeCharacter('/upload/' + pictures[serif.picture_id - 1].path);
}

