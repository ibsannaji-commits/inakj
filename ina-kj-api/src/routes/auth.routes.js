const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, me, refresh } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: { code: 'RATE_LIMIT', message: 'Too many attempts' } },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.get('/me', authenticate, me);

module.exports = router;
