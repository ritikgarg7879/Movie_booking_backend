const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  tls: {}
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

console.log("REDIS URL:", process.env.REDIS_URL);

module.exports = redis;