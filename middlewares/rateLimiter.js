const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redis = require("../config/redis");

// 🔥 Global limiter
const globalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});


// 🔥 Strict Auth limiter
const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 login attempts
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  }
});

module.exports = {
  globalLimiter,
  authLimiter
};