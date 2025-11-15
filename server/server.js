const express = require('express')
const { Sequelize } = require('sequelize')
const session = require('express-session')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieparser = require('cookie-parser')
const sequelize = require('./utils/database')
const path = require('path')
const redisClient = require('./utils/redis')
const multer = require('multer')
const dotenv = require('dotenv')
const { extendDefaultFields } = require('./models/Session')
dotenv.config({ path: './.env' });

var SequelizeStore = require("connect-session-sequelize")(session.Store);

/* Multer Settings for Image Uploading */

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'eventImages')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf') {
    cb(null, true)
  }
}

/* Redis Setup - Optional, app will work without Redis */

async function createRedis() {
  // Only try to connect if Redis URL is provided or explicitly enabled
  if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
    console.log('Redis not configured - app will run without caching')
    return
  }
  
  try {
    redisClient.on('error', err => {
      console.log('Redis Client Error (non-fatal):', err.message)
      // Don't throw - allow app to continue without Redis
    })
    redisClient.on('connect', () => {
      console.log('Redis connected successfully')
    })
    await redisClient.connect()
  } catch (err) {
    console.log('Redis connection failed (non-fatal):', err.message)
    console.log('App will continue without Redis caching')
    // Don't throw - allow app to continue without Redis
  }
}

// Connect to Redis if available, but don't block app startup
createRedis().catch(() => {
  console.log('Redis unavailable - app running without cache')
})



/* Routes */
const authRouter = require('./routes/authRoutes')
const adminRouter = require('./routes/adminRoutes')
const userRouter = require('./routes/userRoutes')

/* Swagger API */
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument))


/* Models */
const User = require('./models/User')
const Event = require('./models/Event')
const UserEventInterested = require('./models/UserEventInterested')
const Ticket = require('./models/Ticket')
const UserTicket = require('./models/UserTicket')

/* Relations */
User.belongsToMany(Event, { through: UserEventInterested })
Event.belongsToMany(User, { through: UserEventInterested })

Event.hasOne(Ticket, { onDelete: 'CASCADE' })
Ticket.belongsTo(Event, { onDelete: 'CASCADE' })

User.belongsToMany(Ticket, { through: UserTicket })
Ticket.belongsToMany(User, { through: UserTicket })


/* Middlewares */
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}))
app.use(cookieparser())
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).array('eventImage', 1))
app.use('/eventImages', express.static(path.join(__dirname, 'eventImages')))
app.use(bodyParser.json())
app.use( // Session store for Sequelize with Dialect PostgreSQL.
  session({
    secret: `${process.env.DB_SESSION_SECRET}`,
    store: new SequelizeStore({
      db: sequelize,
      extendDefaultFields: extendDefaultFields
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 } // Will change secure after the project is ready to go production.
  })
);

/* Health Check Endpoint */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' })
})

/* Routes */

app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/', userRouter)


app.use((error, req, res, next) => {
  const message = error.message
  const statusCode = error.statusCode || 500
  res.status(statusCode).json({ message, statusCode })
})

sequelize.sync().then((res) => {
  const PORT = process.env.PORT || 8080
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
  })
}).catch(err => console.log(err));