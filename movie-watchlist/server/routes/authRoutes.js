const express = require('express')
const { body, validationResult } = require('express-validator')
const { login, me, register } = require('../controllers/authController')
const protect = require('../middleware/protect')

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

const emailValidation = body('email')
  .trim()
  .isEmail()
  .withMessage('A valid email is required')
  .normalizeEmail()

const passwordValidation = body('password')
  .isString()
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters')

router.post(
  '/register',
  body('name').trim().notEmpty().withMessage('Name is required'),
  emailValidation,
  passwordValidation,
  validateRequest,
  register,
)
router.post('/login', emailValidation, passwordValidation, validateRequest, login)
router.get('/me', protect, me)

module.exports = router
