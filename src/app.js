const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/users.routes');
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'LookBook is running!'
    })
});

module.exports = app;