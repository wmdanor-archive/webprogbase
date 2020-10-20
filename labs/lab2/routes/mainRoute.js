const express = require('express');
const HttpError = require('./../httpError');

const body_parser = require('body-parser')
const multer  = require('multer');
const upload = multer({ dest: 'data/images/' });

const mainRouter = express();
const apiRouter = require('./apiRoute');

const expressSwaggerGenerator = require('express-swagger-generator');
const expressSwagger = expressSwaggerGenerator(mainRouter);
 
const config = {
    swaggerDefinition: {
        info: {
            description: 'description',
            title: 'title',
            version: '1.0.0',
        },
        host: 'localhost:55555',
        produces: [ "application/json", "image/png", "image/jpeg" ],
    },
    basedir: __dirname,
    files: ['./../routes/**/*.js', './../models/**/*.js'],
};
expressSwagger(config);

mainRouter.post('/api/books/', body_parser.json(), (err, req, res, next) => {
    if (err) throw new HttpError(400, err.message);
    next();
});
mainRouter.put('/api/books/', body_parser.json(), (err, req, res, next) => {
    if (err) throw new HttpError(400, err.message);
    next();
});
mainRouter.post('/api/media/', upload.single('image_file'), (res, req, next) => { next(); });

mainRouter.use('/api', apiRouter);

mainRouter.use((req, res) => {
    throw new HttpError(400, 'command not found');
});

mainRouter.use((err, req, res, next) => {
    console.log('error caught\n{')
    console.log('    status code: ' + err.status_code + ', message: ' + err.message + '\n}');

    res.status(err.status_code).json({ error: err.message });
});

module.exports = mainRouter;