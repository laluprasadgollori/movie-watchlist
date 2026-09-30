const mongoose = require('mongoose')

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database unavailable. Configure MONGO_URI and restart the server.',
    })
  }

  return next()
}

module.exports = requireDatabase
