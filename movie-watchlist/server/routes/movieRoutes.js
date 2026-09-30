const express = require('express')
const { body, validationResult } = require('express-validator')
const protect = require('../middleware/protect')
const {
  createMovie,
  deleteMovie,
  getMovieById,
  getMovies,
  getTopRatedMovies,
  getWatchedMovies,
  markWatched,
  searchMovies,
  updateMovie,
} = require('../controllers/movieController')

const router = express.Router()

function validateRequest(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    })
  }

  return next()
}

const movieFields = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('posterUrl').optional().isURL().withMessage('Poster URL must be a valid URL'),
  body('year').optional().isInt({ min: 1888 }).withMessage('Year must be 1888 or later'),
]

router.use(protect)
router.post('/', movieFields, validateRequest, createMovie)
router.get('/', getMovies)
router.get('/watched', getWatchedMovies)
router.get('/top-rated', getTopRatedMovies)
router.get('/search', searchMovies)
router.patch('/:id/watched', markWatched)
router.get('/:id', getMovieById)
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('genre').optional().trim().notEmpty().withMessage('Genre cannot be empty'),
    body('posterUrl').optional().isURL().withMessage('Poster URL must be a valid URL'),
    body('year').optional().isInt({ min: 1888 }).withMessage('Year must be 1888 or later'),
    body('watched').optional().isBoolean().withMessage('Watched must be boolean'),
  ],
  validateRequest,
  updateMovie,
)
router.delete('/:id', deleteMovie)

module.exports = router
