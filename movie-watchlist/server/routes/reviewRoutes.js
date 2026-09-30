const express = require('express')
const { body, validationResult } = require('express-validator')
const protect = require('../middleware/protect')
const {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} = require('../controllers/reviewController')

const router = express.Router()

function validateRequest(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
  }
  return next()
}

router.use(protect)
router.post(
  '/',
  body('movie').isMongoId().withMessage('A valid movie is required'),
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),
  validateRequest,
  createReview,
)
router.get('/', getReviews)
router.get('/:id', getReview)
router.put(
  '/:id',
  body('rating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),
  validateRequest,
  updateReview,
)
router.delete('/:id', deleteReview)

module.exports = router
