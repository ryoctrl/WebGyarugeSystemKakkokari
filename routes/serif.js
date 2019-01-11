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
        console.log('return not name');
        res.redirect('/serif');
        return;
    }
    await speakerController.registerSpeaker(name);
    res.redirect('/serif');
});

router.post('/picture/create', upload.single('picture'), async function(req, res, next) {
    const file = req.file;
    if(!file) {
        console.error('file not uploaded');
        res.redirect('/serif');
        return;
    }

    const body = req.body;
    const name = body.name;
    if(!name) {
        console.error('!name');
        res.redirect('/serif');
        return;
    }

    await pictureController.registerPicture(name, file.filename);
    res.redirect('/serif');
});

router.post('/create', upload.single('audio'), async function(req, res, next) {
    const body = req.body;
    const id = body.id;
    if(id) {
        await serifController.update(id, body.name, body.text, null, body.speaker, body.picture);
    } else {
        const file = req.file;
        if(!file) {
            console.error('file not uploaded');
            res.redirect('/serif');
            return;
        }

        const name = body.name;
        const speakerId = body.speaker;
        console.log(name, speakerId);
        if(!name || !speakerId) {
            console.error('!name || !speakerId');
            res.redirect('/serif');
            return;
        }
        const text = await api.speechToText(file.filename);
        if(!text) {
            console.error('api error');
            res.redirect('/serif');
            return;
        }

        await serifController.registerSerif(name, text, file.filename, speakerId, null);
    }
    res.redirect('/serif');
});

module.exports = router;
