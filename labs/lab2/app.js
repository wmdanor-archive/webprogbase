const mainRoute = require('./routes/mainRoute');

mainRoute.listen(55555, () => {
    console.log('Server started');
});