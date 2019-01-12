const express = require('express')
const router = express.Router();
const multer  = require('multer')
const uploadPath = './uploads/'
const upload = multer({ 
    dest: uploadPath,
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const serifController = require('../controllers/serifController');
const speakerController = require('../controllers/speakerController');
const audioController = require('../controllers/audioController');
const fs = require('fs');
const api = require('../controllers/api');
const request = require('request');

/*
{ fieldname: 'markdown',
  originalname: 'TestMarkdown.md',
  encoding: '7bit',
  mimetype: 'text/markdown',
  destination: 'uploads/',
  filename: '9b47c3bbcc0ad6b7a0deb02be5370d21',
  path: 'uploads/9b47c3bbcc0ad6b7a0deb02be5370d21',
  size: 174 }
  */

router.post('/', upload.single('audio'), async (req, res, next) => {
    let file = req.file;
    if(!file) {
        res.render('index', { text: 'ファイルをアップロードしてください', filename: null, speaker: 'ゆかり' });
        return;
    }
    const body = req.body;

    const text = await api.speechToText(file.filename);
    if(!text) {
        res.render('index', { text: 'some error' }); 
        return;
    }
    res.render('index', { text: text, filename: file.filename, speaker: 'ゆかり'});
});

router.get('/:path', async (req, res, next) =>  {
    const path = req.params.path;
    if(!path) {
        console.log(path + 'not found!');
        next();
        return;
    }
    const f = 'uploads/' + path;
    try {
        fs.statSync(f);
    } catch(e) {
        console.log(f + 'not found!');
        next();
        return;
    }
    fs.createReadStream(f).once('open', function() {
        this.pipe(res);
    });
    return;
});

router.post('/data', upload.single('data'), async (req, res, next) => {
    const body = req.body;
    const voiroMode = body.voiro;
    const file = req.file;
    if(!file) {
        res.status(500);
        res.end();
        return;
    }
    const flacname = audioController.wavConvertToFlac(file.filename);
    setTimeout(async function() {
        const name = 'アップロード' + new Date().toString();
        const speakerId = 1;
        const pictureId = 1;
        console.log(name, speakerId, pictureId);
        const text = await api.speechToText(flacname);
        if(!text || text.err) {
            res.status(500);
            res.end(JSON.stringify(text));
            return;
        }
        //ここにVoiceroid埋め込み
        let filename = flacname;
        if(voiroMode) {
            voirofile = await audioController.saveToVoiceroid(text, file.filename).catch(err => { return null });
            if(voirofile) filename = voirofile;
        }
        await serifController.registerSerif(name, text, filename, speakerId, pictureId);
        res.status(200);
        res.end();
    }, 1000);
});

/*
router.post('/voiro', async (req, res, next) => {
    console.log('access to voiro');
    const message = 'test';
    const file = await audioController.saveToVoiceroid(message, new Date().toString()).catch(err => {
        console.error(err);
        return null;
    });

    if(!file) {
        res.status(500);
        res.end();
        return;
    }

    res.status(200);
    res.end(file);
    const url = 'http://192.168.0.6:7180';
    const options = {
        url: url,
        form: {
            CV: 'YUKARI_EX',
            DO: 'SAVE',
            INTONATION: 1,
            PITCH: 1,
            SPEED: 1,
            VOLUME: 1,
            TALKTEXT: message
        }
    };

    request.post(options, function(err, response, body) {
        if(err) {
            console.error(err.toString());
            return;
        }

        console.log(body.length);
        res.status(200);
        res.end();
    });
});
*/

module.exports = router;
