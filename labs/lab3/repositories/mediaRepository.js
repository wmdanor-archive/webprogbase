const MediaInfo = require('../models/media')
const JsonStorage = require('../jsonStorage');

const fs = require('fs');

class MediaRepository
{
    constructor(file_path)
    {
        this.storage = new JsonStorage(file_path);
    }

    getImageById(image_id)
    {
        try {
            const items = this.storage.readItems();
            for (const item of items['items']) {
                if (item['id'] === image_id) {
                    return new MediaInfo(
                        image_id,
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

    addImage(image_model)
    {
        try {
            let items = this.storage.readItems();
            image_model.id = this.storage.nextId;
            this.storage.incrementNextId();
            items['items'].push({
                id: image_model.id,
                file_name: image_model.file_name,
                file_path: image_model.file_path
            });
            this.storage.writeItems(items);
            return image_model;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = MediaRepository;