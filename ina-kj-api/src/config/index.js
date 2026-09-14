require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_SECRET || 'dev-access-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '30m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
  commissionRate: parseFloat(process.env.COMMISSION_RATE || '0.03'),
  defaultDeliveryFee: parseFloat(process.env.DEFAULT_DELIVERY_FEE || '1500'),
  uploadMaxMb: parseInt(process.env.UPLOAD_MAX_MB || '5', 10),
};
