const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadPath = 'uploads/';
const upload = multer({
    dest: uploadPath,
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    }
});
const fs = require('fs');
const api = require('../controllers/api');
const speakerController = require('../controllers/speakerController');
const serifController = require('../controllers/serifController');
const pictureController = require('../controllers/pictureController');
const audioController = require('../controllers/audioController');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const speakers = await speakerController.findAll();
    const serifs = await serifController.findAll();
    const pictures = await pictureController.findAll();
    const obj = {
        serifs: serifs,
        speakers: speakers,
        pictures: pictures
    }
    res.render('serif', obj);
});

router.post('/speaker/create', async function(req, res, next) {
    const body = req.body;
    const name = body.name;
    if(!name) {
        req.session.messages = [{
            err: true,
            message: '話者名が設定されていません'
        }];
        res.redirect('/');
        return;
    }
    await speakerController.registerSpeaker(name);
    req.session.messages = [{
        err: false,
        message: '新たな話者を登録しました'
    }];
    res.redirect('/');
});

router.post('/picture/create', upload.single('picture'), async function(req, res, next) {
    const file = req.file;
    if(!file) {
        req.session.messages = [{
            err: true,
            message: '立ち絵ファイルが添付されていません'
        }];
        res.redirect('/');
        return;
    }

    const body = req.body;
    const name = body.name;
    if(!name) {
        req.session.messages = [{
            err: true,
            message: '立ち絵タイトルが設定されていません'
        }];
        res.redirect('/');
        return;
    }
    req.session.messages = [{
        err: false,
        message: '新たな立ち絵を登録しました'
    }];
    await pictureController.registerPicture(name, file.filename);
    res.redirect('/');
});

router.get('/picture/:id/delete', async function(req, res, next) {
    const id = req.params.id;
    if(!id) {
        res.redirect('/');
        return;
    }

    await pictureController.deleteById(id);
    res.redirect('/');
});

router.get('/speaker/:id/delete', async function(req, res, next) {
    const id = req.params.id;
    if(!id) {
        res.redirect('/');
        return;
    }

    await speakerController.deleteById(id);
    res.redirect('/');
});

router.get('/:id/delete', async function(req, res, next) {
    const id = req.params.id;
    if(!id) {
        res.redirect('/');
        return;
    }

    await serifController.deleteById(id);
    res.redirect('/');
});

router.post('/create', upload.single('audio'), async function(req, res, next) {
    const body = req.body;
    const id = body.id;
    if(id) {
        await serifController.update(id, body.name, body.text, null, body.speaker, body.picture);
    } else {
        const file = req.file;
        if(!file) {
            req.session.messages = [{
                err: true,
                message: '音声ファイルが添付されていません'
            }]
            res.redirect('/');
            return;
        }

        const flacfile = audioController.wavConvertToFlac(file.filename);

        const name = body.name;
        const speakerId = body.speaker;
        const pictureId = body.picture || null;
        console.log(name, speakerId, pictureId);
        if(!name || !speakerId) {
            req.session.messages = [{
                err: true,
                message: 'タイトル又は話者IDが設定されていません'
            }];
            res.redirect('/');
            return;
        }
        const text = await api.speechToText(flacfile);
        if(!text) {
            req.session.messages = [{
                err: true,
                message: '音声認識に失敗しました'
            }];
            res.redirect('/');
            return;
        }

        await serifController.registerSerif(name, text, flacfile, speakerId, pictureId);
    }
    req.session.messages = [{
        err: false,
        message: '新たなセリフを登録しました'
    }];
    res.redirect('/');
});

module.exports = router;
