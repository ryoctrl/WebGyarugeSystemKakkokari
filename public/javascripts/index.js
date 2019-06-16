let playing = false;
let interval;
let displayText = "";
let text = "";
let count = 1;
let strCount = 0;
let cutCount = 0;
let displaying = false;
let textSpeed = 100;
let voiroMode;
let voiceroids;

const recorder = new WzRecorder({
    onRecordingStop: function(blob) {
        const form = new FormData();
        form.append('data', blob);
        form.append('voiro', voiroMode.checked);
        form.append('voice', voiceroids.value);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload/data');
        xhr.onreadystatechange = function() {
            if(xhr.readyState != 4) return;
            if(xhr.status === 200) {
                location.reload();
            } else if(xhr.status === 500) {
                const json = JSON.parse(xhr.response);
                displayAlert(json.message, json.err);
            } else {
                displayAlert('録音した音声の台詞化に失敗しました', true);
            }
        }
        xhr.send(form);
    },
    onRecording: function(milliseconds) {
    }
});

let textEl;
let charaEl;
let serifSelectEl;
let serifPanel;
let namePanel;
let playButton;
let menuEl;
let pictureSelectEl;
let voiroText;

const textWidth = 18;
const lineCharacters = textWidth - 1;
const pageMaxCharacters = lineCharacters * 3;

window.addEventListener('load', function() {
    for(const message of messages) displayAlert(message.message, message.err);
    window.scrollTo(0, 0);
    serifSelectEl = document.getElementById('serif-select');
    serifSelectEl.addEventListener('change', loadAndPlay);
    pictureSelectEl = document.getElementById('picture-select');
    pictureSelectEl.addEventListener('change', changePictureSelect);
    menuEl = document.getElementById('checked');
    charaEl = document.getElementById('char');
    textEl = document.getElementById('text');
    voiroMode = document.getElementById('voiro-mode');
    voiceroids = document.getElementById('voiceoids');
    //voiroText = document.getElementById('voiro-text');
    voiroMode.addEventListener('change', function(e) {
        voiceroids.disabled = !e.target.checked;
        //voiroText.innerText = e.target.checked ? 'ON' : 'OFF';
    });
    serifPanel = document.getElementById('serif');
    namePanel = document.getElementById('speaker-name');
    playButton = document.getElementById('playbutton');
    document.getElementById('recbutton').addEventListener('click', recToggle);
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

let usePicturePath = '-1';

function changePictureSelect() {
    usePicturePath = pictureSelectEl.value;
    if(usePicturePath == -1) {
        //if(serifSelectEl.value == -1) changeCharacter('/upload/df0afcbfa92999b656b76d00c9c4a726');
        if(serifSelectEl.value == -1) changeCharacter('/images/yukari.png');
        else changeImage(serifs[serifSelectEl.selectedIndex - 1]);
    } else {
        changeCharacter('/upload/' + usePicturePath);
    }
}

function recToggle() {
    recorder.toggleRecording();
}

function closeMenu() {
    menuEl.checked = false;
}

function loadAndPlay() {
    if(serifSelectEl.value == -1) {
        wa.stop();
        displayMessage(' ', '');
        changeCharacter('/images/yukari.png');
        //changeCharacter('/upload/d551332d5a2bcc91733a13e6f30e8198');
        return;
    }

    const serif = serifs[serifSelectEl.selectedIndex - 1];
    if(usePicturePath == -1) changeImage(serif);
    wa.loadFile('upload/' + serifSelectEl.value, function(buffer){
        displayAlert('音声のダウンロードが完了しました', false);
        playButton.addEventListener('click', function() {
            if(serifSelectEl.value == -1) return;
            if(playing) {
                wa.stop();
                playing = false;
            }

            wa.play(buffer);
            displayMessage(getSpeakerById(serif.speaker_id).name, serif.text);
            closeMenu();
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
    const cssText = `url("${url}")`;
    if(charaEl.style.backgroundImage === cssText) return;
    charaEl.style.backgroundImage = cssText;
}

function changeImage(serif) {
    if(!serif.picture_id) return;
    const picture = getPictureById(serif.picture_id);
    if(!picture) return;
    changeCharacter('/upload/' + picture.path);
}

function getPictureById(id) {
    for(const picture of pictures) {
        if(picture.id === id) return picture;
    }
}

function getSpeakerById(id) {
    for(const speaker of speakers) {
        if(speaker.id === id) return speaker;
    }
}

