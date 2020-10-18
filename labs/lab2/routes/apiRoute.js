const userRouter = require('./userRoute');
const bookRouter = require('./bookRoute');
const mediaRouter = require('./mediaRoute');

const apiRouter = require('express').Router();

apiRouter
    .use('/users', userRouter)
    .use('/books', bookRouter)
    .use('/media', mediaRouter);

apiRouter.use((req, res) => {
    res.sendStatus(400);
});

module.exports = apiRouter;