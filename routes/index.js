var express = require('express');
var router = express.Router();
const speakerController = require('../controllers/speakerController');
const serifController = require('../controllers/serifController');
const pictureController = require('../controllers/pictureController');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const sessionMessages = req.session.messages || [];
    const messages = [];
    while(sessionMessages.length > 0) {
        const message = sessionMessages.shift();
        messages.push(message);
    }
    const serifs = await serifController.findAll();
    const speakers = await speakerController.findAll();
    const pictures = await pictureController.findAll();
    const obj = {
        speakers: speakers,
        serifs: serifs,
        serifsJson: JSON.stringify(serifs),
        speakersJson: JSON.stringify(speakers),
        picturesJson: JSON.stringify(pictures),
        messages: JSON.stringify(messages),
    };
  res.render('index', obj);
});

module.exports = router;
