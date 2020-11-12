const MediaRepository = require('./../repositories/mediaRepository');
const MediaInfo = require('../models/media');

const mediaRepository = new MediaRepository('./data/media');
const HttpError = require('./../httpError');

module.exports = 
{
    addImage(input, output)
    {
        try {
            const img = mediaRepository.addImage(new MediaInfo(0, input.file.originalname, input.file.path));
            output.status(201).json({id: img.id, file_name: img.file_name});
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    },

    getImage(input, output)
    {
        try {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) throw new HttpError(400, 'id is not a number');
            if (!Number.isInteger(id)) throw new HttpError(400, 'id is not an integer');
            if (id < 1) throw new HttpError(400, 'invalid id value (id < 1)');
            
            const image = mediaRepository.getImageById(id);
            if (image === null) throw new HttpError(404, 'image not found');
            else output.status(200).download(image.file_path, image.file_name);
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    }
}