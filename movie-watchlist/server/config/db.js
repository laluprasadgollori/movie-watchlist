const mongoose = require('mongoose')

async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set; database routes will return 503.')
    return false
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')
    return true
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`)
    return false
  }
}

module.exports = connectDB
