const models = require('../models');

module.exports = {
    registerSerif: async function(name, text, path, speakerId, pictureId) {
        if(!name || !path || !speakerId || !text) {
            return {
                err: true,
                message: 'name or text or path or speakerId not inputted!'
            };
        }

        const obj = {
            name: name,
            text: text,
            path: path,
            speaker_id: speakerId
        };
        if(pictureId) obj.picture_id = pictureId;

        return await models.Serif.create(obj)

    },
    findAll: async function() {
        return await models.Serif.findAll();
    },
    update: async function(id, name, text, path, speakerId, pictureId) {
        if(!id || id == -1) return;
        const query = {
            where: {
                id: id
            }
        };

        const obj = {};
        if(name) obj.name = name;
        if(text) obj.text = text;
        if(path) obj.path = path;
        if(speakerId && speakerId != -1) obj.speaker_id = speakerId;
        if(pictureId && pictureId != -1) obj.picture_id = pictureId;
        console.log(obj);
        await models.Serif.update(obj, query);
    }
}
