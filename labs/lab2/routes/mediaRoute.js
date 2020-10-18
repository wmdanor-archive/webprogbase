const express = require('express');
const mediaController = require('../controllers/mediaController');

const mediaRouter = require('express').Router();

mediaRouter
    /**
     * @route POST /api/media
     * @group Images - image operations
     * @param {file} image_file.formData.required - image model to add
     * @returns {Image.model} 201 - Image created
     * @returns {Error} 400 - Bad request
     */
    .post('/', mediaController.addImage)
    /**
     * @route GET /api/media/{id}
     * @group Images - image operations
     * @param {integer} id.path.required - id of the Image
     * @returns {file} 200 - Image file bytes
     * @returns {Error} 400 - Bad request
     * @returns {Error} 404 - Image not found
    */
    .get('/:id', mediaController.getImage);

mediaRouter.use((req, res) => {
    res.sendStatus(400);
});

module.exports = mediaRouter;