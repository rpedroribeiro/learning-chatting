import { RequestHandler } from 'express'
import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

/**
 * This function takes in a user, grabs their id, and returns
 * an access token that expires after 15 minutes.
 * 
 * @param user - The user that we are generating the access
 * token for which provides their id.
 * @returns - The access token that expires after 15 minutes.
 */
const generateAccessToken = (user: any) => {
  const jwtSecret: string = process.env.JWT_ACCESS_SECRET!
  return jwt.sign({ userId: user.id }, jwtSecret, {
    expiresIn: '15m',
  })
}

/**
 * This function uses a method from crypto to generate a random
 * 16 character long string that will serve as the refresh token.
 * 
 * @returns A generated string that will serve as the refresh
 * token.
 */
const generateRefreshToken = () => {
  const token: string = crypto.randomBytes(16).toString('base64url')
  return token
}

/**
 * This function takes in a user, and passes him into the 
 * generateAccessToken function and also calls the generateRefreshToken
 * function, and returning the results from both.
 * 
 * @param user - The user we are generating both an access token
 * and a refresh token.
 * @returns - The generated accessTokena and refreshToken
 */
const generateTokens = (user: any) => {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken()
  return { accessToken, refreshToken }
}
  

/**
 * This function takes in a token stringand returns a SHA-512 hash 
 * of that token in hexadecimal format.
 * 
 * @param token - The token string to be hashed
 * @returns - The SHA-512 hash of the token in hexadecimal format
 */
const hashToken = (token: any): string => {
  return crypto.createHash('sha512').update(token).digest('hex')
}

/**
 * This function takes in the request in the route before handling logic
 * and checks for the access token authentication validity.
 * 
 * @param req - The contents of the request.
 * @param res - The response of the request.
 * @param next - The next function after the request is proccessed.
 */
export const authenticateToken: RequestHandler = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({ message: "No token provided" })
    return
  }
  const jwtSecret = process.env.JWT_ACCESS_SECRET!
  jwt.verify(token, jwtSecret, (err: any) => {
    if (err) {
      if ((err as jwt.TokenExpiredError).name === "TokenExpiredError") {
        res.status(401).json({ message: "Token expired" })
      } else {
        res.status(401).json({ message: "Token is not valid" })
      }
      return
    }
    next()
  })
}

const authJwt = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  hashToken,
  authenticateToken,
}

export default authJwt