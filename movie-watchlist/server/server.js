require('dotenv').config()

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const movieRoutes = require('./routes/movieRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const requireDatabase = require('./middleware/requireDatabase')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/api/auth', requireDatabase, authRoutes)
app.use('/api/movies', requireDatabase, movieRoutes)
app.use('/api/reviews', requireDatabase, reviewRoutes)

app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1
  res.status(databaseConnected ? 200 : 503).json({
    database: databaseConnected ? 'connected' : 'unavailable',
    status: databaseConnected ? 'ok' : 'degraded',
  })
})

if (require.main === module) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  })
}

module.exports = app
