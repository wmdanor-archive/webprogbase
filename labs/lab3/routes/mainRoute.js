const express = require('express');
const path = require('path');
const mustache = require('mustache-express');
const methodOverride = require('method-override');
const HttpError = require('./../httpError');

const body_parser = require('body-parser')
const multer  = require('multer');
const upload = multer({ dest: 'data/images/' });

const mainRouter = express();
const apiRouter = require('./apiRoute');
const mstUserRouter = require('./mstUserRoute');
const mstBookRouter = require('./mstBookRoute');


//#region swagger documentation

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

//#endregion


// const consolidate = require('consolidate');
// mainRouter.engine('html', consolidate.swig);
// mainRouter.set('views', path.join(__dirname, '../views'));
// mainRouter.set('view engine', 'html');

const viewsDir = path.join(__dirname, '../views');

mainRouter.engine("mst", mustache(path.join(viewsDir, "partials")));
mainRouter.set('views', viewsDir);
mainRouter.set('view engine', 'mst');
//

mainRouter.use(methodOverride('_method'));


//#region api

mainRouter.post('/api/books/', body_parser.json(), (err, req, res, next) => {
    if (err) throw new HttpError(400, err.message);
    next();
});
mainRouter.put('/api/books/', body_parser.json(), (err, req, res, next) => {
    if (err) throw new HttpError(400, err.message);
    next();
});
mainRouter.post('/api/media/', upload.single('media_file'), (req, res, next) => { next(); });

mainRouter.use('/api', apiRouter);

//#endregion


//#region web documents

mainRouter.use(express.static('public'));

mainRouter.post('/books', upload.single('book_file'));
mainRouter.post('/books', body_parser.urlencoded({ extended: true }));

mainRouter
    .use('/users', mstUserRouter)
    .use('/books', mstBookRouter)

mainRouter.use('/about/', (req, res) => {
    res.render('about', {head_title: 'About', about_current: 'current'});
});

mainRouter.use('/', (req, res) => {
    res.render('index', {head_title: 'Home', home_current: 'current'});
});

//#endregion


mainRouter.use((req, res) => {
    throw new HttpError(400, 'command not found');
});

mainRouter.use((err, req, res, next) => {
    console.log('error caught\n{')
    console.log('    status code: ' + err.status_code + ', message: ' + err.message + '\n}');

    res.status(err.status_code).render('error', {head_title: 'Error', error: err.status_code + ' | ' + err.message, });
});

module.exports = mainRouter;