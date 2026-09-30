const mongoose = require('mongoose')
const Movie = require('../models/Movie')
const Review = require('../models/Review')

async function recalculateMovieRating(movieId) {
  const [rating] = await Review.aggregate([
    { $match: { movie: new mongoose.Types.ObjectId(movieId) } },
    { $group: { _id: '$movie', avgRating: { $avg: '$rating' } } },
  ])

  await Movie.findByIdAndUpdate(movieId, {
    avgRating: rating ? Number(rating.avgRating.toFixed(1)) : null,
  })
}

function validId(id) {
  return mongoose.isValidObjectId(id)
}

async function createReview(req, res) {
  const { movie, rating, comment } = req.body

  if (!validId(movie)) {
    return res.status(400).json({ message: 'Invalid movie id' })
  }

  const ownedMovie = await Movie.findOne({ _id: movie, addedBy: req.user._id })
  if (!ownedMovie) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const existingReview = await Review.findOne({ movie, user: req.user._id })
  if (existingReview) {
    return res.status(400).json({ message: 'You have already reviewed this movie' })
  }

  const review = await Review.create({ movie, user: req.user._id, rating, comment })
  await recalculateMovieRating(movie)
  return res.status(201).json(review)
}

async function getReviews(req, res) {
  const filter = { user: req.user._id }

  if (req.query.movie) {
    if (!validId(req.query.movie)) {
      return res.status(400).json({ message: 'Invalid movie id' })
    }
    filter.movie = req.query.movie
  }

  const reviews = await Review.find(filter).populate('user', 'name').sort({ createdAt: -1 })
  return res.status(200).json({ data: reviews })
}

async function getReview(req, res) {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid review id' })
  }

  const review = await Review.findOne({ _id: req.params.id, user: req.user._id }).populate('user', 'name')
  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }

  return res.status(200).json(review)
}

async function updateReview(req, res) {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid review id' })
  }

  const review = await Review.findOne({ _id: req.params.id, user: req.user._id })
  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }

  if (req.body.rating !== undefined) review.rating = req.body.rating
  if (req.body.comment !== undefined) review.comment = req.body.comment
  await review.save()
  await recalculateMovieRating(review.movie)
  return res.status(200).json(review)
}

async function deleteReview(req, res) {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid review id' })
  }

  const review = await Review.findOne({ _id: req.params.id, user: req.user._id })
  if (!review) {
    return res.status(404).json({ message: 'Review not found' })
  }

  const movieId = review.movie
  await review.deleteOne()
  await recalculateMovieRating(movieId)
  return res.status(200).json({ message: 'Review deleted successfully' })
}

module.exports = { createReview, deleteReview, getReview, getReviews, updateReview }
