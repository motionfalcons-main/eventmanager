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

// Add helper methods that handle connection errors gracefully
const safeRedis = {
  isConnected: false,
  
  async get(key) {
    if (!this.isConnected) return null
    try {
      return await client.get(key)
    } catch (err) {
      console.log('Redis get error (non-fatal):', err.message)
      return null
    }
  },
  
  async set(key, value, options) {
    if (!this.isConnected) return
    try {
      await client.set(key, value, options)
    } catch (err) {
      console.log('Redis set error (non-fatal):', err.message)
    }
  },
  
  async del(key) {
    if (!this.isConnected) return
    try {
      await client.del(key)
    } catch (err) {
      console.log('Redis del error (non-fatal):', err.message)
    }
  }
}

// Set connection status
client.on('connect', () => {
  safeRedis.isConnected = true
})

client.on('error', () => {
  safeRedis.isConnected = false
})

client.on('end', () => {
  safeRedis.isConnected = false
})

// Export both the client and safe wrapper
module.exports = client
module.exports.safe = safeRedis

