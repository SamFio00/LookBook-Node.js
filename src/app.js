const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/users.routes');
const productRoutes = require('./routes/products.routes');
const swapsRoutes = require('./routes/swaps.routes');
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/swaps', swapsRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'LookBook is running!'
    })
});

module.exports = app;