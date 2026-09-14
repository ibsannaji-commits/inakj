const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokens');
const { sendError } = require('../utils/errors');

const SALT_ROUNDS = 12;

async function register(req, res) {
  try {
    const { phone, password, fullName, role, email, location, city, region } = req.body;

    if (!phone || !password || !fullName || !role) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'phone, password, fullName, role required');
    }
    if (!['farmer', 'buyer'].includes(role)) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'role must be farmer or buyer');
    }
    if (password.length < 6) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Password min 6 characters');
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return sendError(res, 409, 'CONFLICT', 'Phone already registered');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        phone,
        passwordHash,
        fullName,
        role,
        email: email || null,
        location: location || null,
        city: city || null,
        region: region || null,
      },
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Registration failed');
  }
}

async function login(req, res) {
  try {
    const { phone, email, password } = req.body;
    if (!password || (!phone && !email)) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'phone/email and password required');
    }

    const user = await prisma.user.findFirst({
      where: phone ? { phone } : { email },
    });
    if (!user) {
      return sendError(res, 401, 'UNAUTHORIZED', 'Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return sendError(res, 401, 'UNAUTHORIZED', 'Invalid credentials');
    }

    const safe = {
      id: user.id,
      phone: user.phone,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isVerified: user.isVerified,
    };

    return res.json({
      user: safe,
      accessToken: signAccessToken(safe),
      refreshToken: signRefreshToken(safe),
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'SERVER_ERROR', 'Login failed');
  }
}

async function me(req, res) {
  return res.json({ user: req.user });
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'refreshToken required');
    }
    const payload = verifyRefreshToken(refreshToken);
    if (payload.type !== 'refresh') {
      return sendError(res, 401, 'UNAUTHORIZED', 'Invalid refresh token');
    }
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return sendError(res, 401, 'UNAUTHORIZED', 'User not found');
    }
    const safe = {
      id: user.id,
      phone: user.phone,
      role: user.role,
      fullName: user.fullName,
    };
    return res.json({
      accessToken: signAccessToken(safe),
      refreshToken: signRefreshToken(safe),
    });
  } catch {
    return sendError(res, 401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }
}

module.exports = { register, login, me, refresh };
