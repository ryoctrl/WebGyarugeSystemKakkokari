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
const fs = require('fs');
const api = require('../controllers/api');

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
    /*
    res.status(200);

    res.end();
    */
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

module.exports = router;
