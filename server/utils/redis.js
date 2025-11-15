const { createClient } = require('redis')

// Use REDIS_URL if available (for Render/Heroku), otherwise use individual config
let redisConfig = {}
if (process.env.REDIS_URL) {
  redisConfig = {
    url: process.env.REDIS_URL
  }
} else {
  redisConfig = {
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    },
    password: process.env.REDIS_PASSWORD || undefined
  }
}

const client = createClient(redisConfig)

module.exports = client

