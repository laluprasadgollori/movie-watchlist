const mongoose = require('mongoose')
const Movie = require('../models/Movie')

function isValidMovieId(id) {
  return mongoose.isValidObjectId(id)
}

function pagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 100)

  return { limit, page, skip: (page - 1) * limit }
}

function sameOwner(movie, user) {
  return movie.addedBy.toString() === user._id.toString()
}

async function createMovie(req, res) {
  try {
    const movie = await Movie.create({
      title: req.body.title,
      genre: req.body.genre,
      posterUrl: req.body.posterUrl,
      year: req.body.year,
      addedBy: req.user._id,
    })

    return res.status(201).json(movie)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }

    throw error
  }
}

async function getMovies(req, res) {
  const { limit, page, skip } = pagination(req.query)
  const filter = { addedBy: req.user._id }
  const [data, totalCount] = await Promise.all([
    Movie.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Movie.countDocuments(filter),
  ])

  return res.status(200).json({
    data,
    limit,
    page,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  })
}

async function getMovieById(req, res) {
  if (!isValidMovieId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid movie id' })
  }

  const movie = await Movie.findOne({
    _id: req.params.id,
    addedBy: req.user._id,
  })

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  return res.status(200).json(movie)
}

async function markWatched(req, res) {
  if (!isValidMovieId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid movie id' })
  }

  const movie = await Movie.findOne({
    _id: req.params.id,
    addedBy: req.user._id,
  })

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movie.watched = true
  await movie.save()
  return res.status(200).json(movie)
}

async function getWatchedMovies(req, res) {
  const { limit, page, skip } = pagination(req.query)
  const filter = { addedBy: req.user._id, watched: true }
  const [data, totalCount] = await Promise.all([
    Movie.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Movie.countDocuments(filter),
  ])

  return res.status(200).json({
    data,
    limit,
    page,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  })
}

async function getTopRatedMovies(req, res) {
  const { limit, page, skip } = pagination(req.query)
  const filter = {
    addedBy: req.user._id,
    avgRating: { $ne: null },
  }
  const [data, totalCount] = await Promise.all([
    Movie.find(filter).sort({ avgRating: -1, createdAt: -1 }).skip(skip).limit(limit),
    Movie.countDocuments(filter),
  ])

  return res.status(200).json({
    data,
    limit,
    page,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  })
}

async function searchMovies(req, res) {
  const query = req.query.q?.trim()

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' })
  }

  const { limit, page, skip } = pagination(req.query)
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const filter = {
    addedBy: req.user._id,
    title: { $regex: escapedQuery, $options: 'i' },
  }
  const [data, totalCount] = await Promise.all([
    Movie.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Movie.countDocuments(filter),
  ])

  return res.status(200).json({
    data,
    limit,
    page,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  })
}

async function updateMovie(req, res) {
  if (!isValidMovieId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid movie id' })
  }

  const movie = await Movie.findById(req.params.id)

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  if (!sameOwner(movie, req.user)) {
    return res.status(403).json({ message: 'You do not own this movie' })
  }

  const editableFields = ['title', 'genre', 'posterUrl', 'year', 'watched']
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      movie[field] = req.body[field]
    }
  })

  try {
    await movie.save()
    return res.status(200).json(movie)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }

    throw error
  }
}

async function deleteMovie(req, res) {
  if (!isValidMovieId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid movie id' })
  }

  const movie = await Movie.findById(req.params.id)

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  if (!sameOwner(movie, req.user)) {
    return res.status(403).json({ message: 'You do not own this movie' })
  }

  await movie.deleteOne()
  return res.status(200).json({ message: 'Movie deleted successfully' })
}

module.exports = {
  createMovie,
  deleteMovie,
  getMovieById,
  getMovies,
  getTopRatedMovies,
  getWatchedMovies,
  markWatched,
  searchMovies,
  updateMovie,
}
