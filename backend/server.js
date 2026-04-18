const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const dotenv     = require('dotenv');
const cors       = require('cors');
const connectDB  = require('./config/db');

dotenv.config();
connectDB();

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', methods: ['GET','POST'] }
});

app.use(cors());
app.use(express.json());

// Attach io to every request so controllers can emit events
app.use((req, res, next) => { req.io = io; next(); });

app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/boards',  require('./routes/boardRoutes'));
app.use('/api/columns', require('./routes/columnRoutes'));
app.use('/api/tasks',   require('./routes/taskRoutes'));

io.on('connection', (socket) => {
  socket.on('joinBoard',  (boardId) => socket.join(boardId));
  socket.on('leaveBoard', (boardId) => socket.leave(boardId));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));