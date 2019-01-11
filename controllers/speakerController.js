const models = require('../models');

module.exports = {
    registerSpeaker: async function(name) {
        if(!name) {
            return { 
                err: true,
                message: 'name not inputted'
            };
        };
        const existed = await models.Speaker.findOne({ where: { name: name} });
        if(existed) {
            return {
                err: true,
                message: 'name is existed',
                record: existed
            };
        }

        const record = await models.Speaker.create({
            name: name
        });

        return {
            err: false,
            record: record
        };
    },
    findAll: async function() {
        return await models.Speaker.findAll();
    },
    findOneById: async function(id) {
        if(!id) return null;
        const query = {
            where: {
                id: id
            }
        };
        return await models.Speaker.findOne(query);
    }

}
