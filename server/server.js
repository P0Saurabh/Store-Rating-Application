const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');

// Connect to Database
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api', require('./routes/dataRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Conditional listen for local development
// if (require.main === module) {
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// }

module.exports = app;
