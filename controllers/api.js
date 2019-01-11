const speech = require('@google-cloud/speech');
const fs = require('fs');


module.exports = {
    speechToText: async function(name) {
        const client = new speech.SpeechClient();
        const filepath = 'uploads/' + name;

        const file = fs.readFileSync(filepath);
        const audioBytes = file.toString('base64');

        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
          content: audioBytes,
        };
        const config = {
          encoding: 'FLAC',
//          encoding: 'LINEAR16',
          sampleRateHertz: 44100,
          languageCode: 'ja-JP',
        };
        const request = {
          audio: audio,
          config: config,
        };
        console.log('requesting client');
        const data = await client.recognize(request).catch(err => {
            console.log('error!');
            console.error('ERROR:', err);
            return null;
        });

        if(!data) {
            console.log('return null');
            return null;
        }

        console.log(data);
        const res = data[0];
        const transcription = res.results.map(result => result.alternatives[0].transcript).join('\n');
        console.log('returning transcription');
        console.log(transcription);
        return transcription;
    }
}

