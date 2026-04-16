const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/boards',  require('./routes/boardRoutes'));
app.use('/api/columns', require('./routes/columnRoutes'));
app.use('/api/tasks',   require('./routes/taskRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'TaskBoard API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));