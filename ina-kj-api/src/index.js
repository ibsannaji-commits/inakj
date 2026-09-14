const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');

const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ['GET', 'POST'],
  },
});

// --- Global middleware ---
app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Health ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ina-kj-api', time: new Date().toISOString() });
});

// --- API v1 ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/orders', ordersRoutes);

// Stubs for remaining modules (extend as needed)
app.use('/api/v1/market-prices', (req, res) => {
  res.json({
    data: [],
    message: 'Implement market-prices controller — see docs/API.md',
  });
});
app.use('/api/v1/conversations', (req, res) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Chat REST — see docs/API.md + Socket.io' },
  });
});
app.use('/api/v1/admin', (req, res) => {
  res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'Admin routes — see docs/API.md' },
  });
});

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// --- Socket.io (chat skeleton) ---
io.use((socket, next) => {
  // TODO: verify JWT from socket.handshake.auth.token
  next();
});

io.on('connection', (socket) => {
  socket.on('join', (conversationId) => {
    socket.join(`conv:${conversationId}`);
  });
  socket.on('message:new', (payload) => {
    // TODO: persist message, then:
    if (payload?.conversationId) {
      io.to(`conv:${payload.conversationId}`).emit('message:new', payload);
    }
  });
  socket.on('disconnect', () => {});
});

server.listen(config.port, () => {
  console.log(`INA-KJ API listening on :${config.port}`);
  console.log(`Health: http://localhost:${config.port}/health`);
  console.log(`API:    http://localhost:${config.port}/api/v1`);
});
