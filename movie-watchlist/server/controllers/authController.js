const jwt = require('jsonwebtoken')
const User = require('../models/User')

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

async function register(req, res) {
  const { name, email, password } = req.body
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered' })
  }

  const user = new User({ name, email, password })
  await user.save()

  return res.status(201).json({
    user: publicUser(user),
    token: createToken(user._id),
  })
}

async function login(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  return res.status(200).json({
    user: publicUser(user),
    token: createToken(user._id),
  })
}

async function me(req, res) {
  return res.status(200).json({ user: publicUser(req.user) })
}

module.exports = { login, me, register }
