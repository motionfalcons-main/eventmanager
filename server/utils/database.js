const dotenv = require('dotenv')
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const { Sequelize } = require('sequelize')

// Use DATABASE_URL if available (for Render/Heroku), otherwise use individual config
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  })
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'eventmanager',
    process.env.DB_USER || 'postgres',
    process.env.DB_PW,
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres'
    }
  )
}

module.exports = sequelize