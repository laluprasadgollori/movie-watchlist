const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  posterUrl: {
    type: String,
    trim: true,
  },
  year: {
    type: Number,
    min: 1888,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  watched: {
    type: Boolean,
    default: false,
  },
  avgRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

movieSchema.index({ title: 'text' })
movieSchema.index({ addedBy: 1, createdAt: -1 })

module.exports = mongoose.model('Movie', movieSchema)
