const jwt = require('jsonwebtoken');
const config = require('../config');

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpires }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpires }
  );
}

function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwt.refreshSecret);
}

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken };
