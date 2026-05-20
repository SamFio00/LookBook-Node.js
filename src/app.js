const express = require('express');
const app = express();


app.use(express.json());

const userRoutes = require('./routes/users.routes');
const productRoutes = require('./routes/products.routes');
const swapsRoutes = require('./routes/swaps.routes');

const errorHandler = require('./middlewares/errorHandler.middleware');
const notFound = require('./middlewares/notFound.middleware');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/swaps', swapsRoutes);
app.use('/uploads', express.static('uploads'));

app.use(notFound);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'LookBook is running!'
    })
});

module.exports = app;