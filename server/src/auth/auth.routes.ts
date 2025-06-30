import express from 'express'
import * as bcrypt from 'bcrypt'
import authJwt from './auth.jwt'
import authServices from './auth.services'
import { prisma } from '../context/context'

const router = express.Router()
const ctx = { prisma }

/**
 * Registers a new user with email, password, first name, and last name.
 * It returns both the accessToken and the refreshToken after adding the user
 * and their refresh token to the database.
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, accountType } = req.body
    const existingUser = await authServices.findUserByEmail(email, ctx)

    if (existingUser) {
      res.status(400).json({message: 'Email already in use.'})
      throw new Error('Email already in use.')
    }

    const user = await authServices.createUserByEmailAndPassword({
      email,
      password,
      firstName,
      lastName,
      accountType,
    }, ctx)

    const { accessToken, refreshToken } = authJwt.generateTokens(user)
    await authServices.addRefreshTokenToWhiteList(refreshToken, user.id)

    res.cookie('refreshToken', refreshToken, {
      'httpOnly': true,
      'secure': true,
      'sameSite': 'none'
    })

    res.cookie('accessToken', accessToken, {
      'httpOnly': true,
      'secure': true,
      'sameSite': 'none',
    })

    res.status(200).json({
      userId: user.id,
      message: "User successfuly logged in",
      accountType: user.accountType
    })
  } catch (error) {
    next(error)
  }
})

/**
 * Logs in a user with both their email and password. Both params are check
 * if they match in the current databse and then returns both the accessToken
 * and a refreshToken upon completion.
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const existingUser = await authServices.findUserByEmail(email, ctx)

    if (!existingUser || existingUser === null) {
      res.status(403).json({message: 'Invalid Credentials.'})
      throw new Error('Invalid Credentials.')
    }

    const validPassword = await bcrypt.compare(password, existingUser.password)
    if (!validPassword) {
      res.status(403).json({message: 'Invalid Credentials.'})
      throw new Error('Invalid Credentials.')
    }

    const { accessToken, refreshToken } = authJwt.generateTokens(existingUser)
    await authServices.addRefreshTokenToWhiteList(refreshToken, existingUser.id)

    res.cookie('refreshToken', refreshToken, {
      'httpOnly': true,
      'secure': true,
      'sameSite': 'none'
    })

    res.cookie('accessToken', accessToken, {
      'httpOnly': true,
      'secure': true,
      'sameSite': 'none',
    })

    res.status(200).json({
      userId: existingUser.id,
      message: "User successfuly logged in",
      accountType: existingUser.accountType
    })
  } catch (error) {
    next(error)
  }
})

/**
 * Issues a new refreshToken and accessToken if the refreshToken passed
 * in and the userId are valid.
 */
router.post('/refreshToken', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(400);
      throw new Error('Missing refresh token.')
    }

    const validRefreshToken = await authServices.findRefreshToken(refreshToken)
    if (!validRefreshToken
      || validRefreshToken.revoked === true
      || Date.now() > validRefreshToken.expireAt.getTime()
    ) {
      res.status(401)
      throw new Error('Unauthorized')
    }

    const validUser = await authServices.findUserById(refreshToken.userId, ctx)
    if (!validUser || validUser === null) {
      res.status(401)
      throw new Error('Unauthorized')
    }

    await authServices.deleteRefreshTokenById(refreshToken)
    const { accessToken, refreshToken: newRefreshToken } = authJwt.generateTokens(validUser)
    await authServices.addRefreshTokenToWhiteList(refreshToken, validUser.id)

    res.cookie('refreshToken', refreshToken, {
      'httpOnly': true,
      'secure': true,
      'sameSite': 'none'
    })

    res.cookie('accessToken', accessToken, {
      'httpOnly': true,
      'secure': true,
      'sameSite': 'none',
    })

    res.status(200).json({
      userId: validUser.id,
      message: "User successfuly logged in",
      accountType: validUser.accountType
    })
  } catch (error) {
    next(error)
  }
})

/**
 * Revokes all refreshTokens associated with the userId
 */
router.post('/revokeRefreshToken', async (req, res, next) => {
  const { userId } = req.body
  authServices.revokeTokens(userId)
  res.status(200).json({message: `Token revoked for User with Id ${userId}`})
})

export default router