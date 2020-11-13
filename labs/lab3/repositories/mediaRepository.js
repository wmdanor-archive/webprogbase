const MediaInfo = require('../models/media')
const JsonStorage = require('../jsonStorage');

const fs = require('fs');

class MediaRepository
{
    constructor(file_path)
    {
        this.storage = new JsonStorage(file_path);
    }

    getMediaById(media_id)
    {
        try {
            const items = this.storage.readItems();
            for (const item of items['items']) {
                if (item['id'] === media_id) {
                    return new MediaInfo(
                        media_id,
                        item['file_name'],
                        item['file_path']
                    )
                }
            }
            return null;
        } catch (err) {
            throw err;
        }
    }

    addMedia(mdeia_model)
    {
        try {
            let items = this.storage.readItems();
            mdeia_model.id = this.storage.nextId;
            this.storage.incrementNextId();
            items['items'].push({
                id: mdeia_model.id,
                file_name: mdeia_model.file_name,
                file_path: mdeia_model.file_path
            });
            this.storage.writeItems(items);
            return mdeia_model;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = MediaRepository;