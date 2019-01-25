const spawn = require('child_process').spawn;
const request = require('request').defaults({ encoding: null});
const fs = require('fs');
const voiceroids = {
    'yukari': 'YUKARI_EX',
    'akane': 'akane',
    'aoi': 'aoi',
    'kiritan': 'kiritan',
    'akari': 'akari',
    'maki': 'TAMMY_EX'
};

module.exports = {
    wavConvertToFlac: function(filename) {
        const options = [];
        options.push('-i');
        options.push('uploads/' + filename);
        options.push('-vn');
        options.push('-ac');
        options.push(1);
        options.push('-ar');
        options.push('44100');
        options.push('-acodec');
        options.push('flac');
        options.push('-f');
        options.push('flac');
        const flacPath = filename + '-flac';
        options.push('uploads/' + flacPath);
        spawn('ffmpeg', options);
        return flacPath;
    },
    saveToVoiceroid: function(text, filename, voiceroid) {
        if(!text) return;
        const voiro = voiceroids[voiceroid] || 'YUKARI_EX';
        console.log('requesting voiceroid : ' + voiro);
        const voirofile = filename + '-voiro';
        const url = 'http://192.168.0.6:7180';
        const options = {
            url: url,
            form: {
                CV: voiro,
                DO: 'SAVE',
                INTONATION: 1,
                PITCH: 1,
                SPEED: 1,
                VOLUME: 1,
                TALKTEXT: text
            }
        };

        return new Promise(function(resolve, reject) {
            request.post(options, function(err, res, body) {
                if(!err && res.statusCode === 200) {
                    fs.writeFileSync('uploads/' + voirofile, body, 'binary');
                    resolve(voirofile);
                } else {
                    reject(err);
                }
            });
        });
    }
}
