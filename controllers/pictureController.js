const models = require('../models');

module.exports = {
    registerPicture: async function(name, path) {
        if(!name || !path) {
            return { 
                err: true,
                message: 'name or path not inputted'
            };
        };
        const existed = await models.Picture.findOne({ where: { name: name} });
        if(existed) {
            return {
                err: true,
                message: 'name is existed',
                record: existed
            };
        }

        const record = await models.Picture.create({
            name: name,
            path: path
        });

        return {
            err: false,
            record: record
        };
    },
    findAll: async function() {
        return await models.Picture.findAll();
    },
    findOneById: async function(id) {
        if(!id) return null;
        const query = {
            where: {
                id: id
            }
        };
        return await models.Picture.findOne(query);
    }

}
