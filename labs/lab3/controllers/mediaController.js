const MediaRepository = require('./../repositories/mediaRepository');
const MediaInfo = require('../models/media');

const mediaRepository = new MediaRepository('./data/media');
const HttpError = require('./../httpError');

module.exports = 
{
    addMedia(input, output)
    {
        try {
            const media = mediaRepository.addMedia(new MediaInfo(0, input.file.originalname, input.file.path));
            output.status(201).json({id: media.id, file_name: media.file_name});
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    },

    getMedia(input, output)
    {
        try {
            const id_str = input.params.id;
            const id = Number(id_str);
            if (isNaN(id)) throw new HttpError(400, 'id is not a number');
            if (!Number.isInteger(id)) throw new HttpError(400, 'id is not an integer');
            if (id < 1) throw new HttpError(400, 'invalid id value (id < 1)');
            
            const media = mediaRepository.getMediaById(id);
            if (media === null) throw new HttpError(404, 'media not found');
            else output.status(200).download(media.file_path, media.file_name);
        }
        catch (err)
        {
            if (err instanceof HttpError) throw err;
            else throw new HttpError(500, err.message);
        }
    }
}