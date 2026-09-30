const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function protect(req, res, next) {
  const authorization = req.get('Authorization')
  const [scheme, token] = authorization ? authorization.split(' ') : []

  if (scheme !== 'Bearer' || !token || !process.env.JWT_SECRET) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    req.user = user
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' })
  }
}

module.exports = protect
