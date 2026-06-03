const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();


app.use(express.json());

app.use((req, res, next) => {
    req.body = mongoSanitize.sanitize(req.body);
    req.params = mongoSanitize.sanitize(req.params);
    req.query = mongoSanitize.sanitize(req.query);
    next();
});

const userRoutes = require('./routes/users.routes');
const productRoutes = require('./routes/products.routes');
const swapsRoutes = require('./routes/swaps.routes');

const errorHandler = require('./middlewares/errorHandler.middleware');
const notFound = require('./middlewares/notFound.middleware');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/swaps', swapsRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'LookBook is running!'
    })
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;