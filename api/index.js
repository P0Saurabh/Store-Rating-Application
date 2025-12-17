const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('../server/config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('../server/routes/authRoutes');

// Connect to Database
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api', require('../server/routes/dataRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
