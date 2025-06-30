import * as bcrypt from 'bcrypt'
import db from '../database/prisma'
import authJwt from './auth.jwt'

/**
 * This funciton takes in the user email and uses
 * prisma's ORM to return a user object.
 * 
 * @param email - The email of the user.
 * @returns - The user object from the db.
 */
const findUserByEmail = async (email: string) => {
  return await db.user.findUnique({
    where:{
      email,
    },
    include: {
      studentClasses: true,
      professorClasses: true
    }
  })
}

/**
 * This funciton takes in the user id and uses
 * prisma's ORM to return a user object.
 * 
 * @param id - The id of the user.
 * @returns - The user object from the db.
 */
const findUserById = async (id: string) => {
  return await db.user.findUnique({
    where:{
      id,
    },
    include: {
      studentClasses: true,
      professorClasses: true
    }
  })
}

/**
 * This function creates a user with the default auth of
 * email and password and returns the new user object.
 * 
 * @param user - All the user information to create an
 * account
 * @returns - The user object from prisma's ORM
 */
const createUserByEmailAndPassword = async (user: any) => {
  user.password = bcrypt.hashSync(user.password, 12)
  return db.user.create({
    data: user,
  })
}

/**
 * This function takes in the refreshToken and the userId and creates 
 * a token using prisma's ORM and authJwt.hashToken(). The refresh token
 * is then set to expire in 30 days.
 * 
 * @param refreshToken - The refresh token created that will be hashed into 
 * the database.
 * @param userId  - The userId for the schema that conencts the user and their
 * token.
 * @returns - The refreshToken object created by prisma's ORM.
 */
const addRefreshTokenToWhiteList = async (refreshToken: string, userId: string) => {
  return db.refreshToken.create({
    data: {
      hashedToken: authJwt.hashToken(refreshToken),
      userId,
      expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 Days
    },
  })
}

/**
 * This funciton finds the refreshToken in the database using a
 * token string and returns the result.
 * 
 * @param token - The token we want to find in the database.
 * @returns - The refreshToken object found by prisma's ORM.
 */
const findRefreshToken = async (token: string) => {
  return db.refreshToken.findUnique({
    where: {
      hashedToken: authJwt.hashToken(token)
    },
  })
}

/**
 * This function takes in the tokenId, finds it in the database,
 * and then deletes the token.
 * 
 * @param tokenId - The id of the token in the refreshToken
 * @returns - The deleted token object using prisma's ORM.
 */
const deleteRefreshTokenById = async (tokenId: string) => {
  return db.refreshToken.update({
    where: {
      id: tokenId,
    },
    data: {
      revoked: true,
    },
  })
}

/**
 * This function takes in the userId of the token, finds it in the
 * database, and revokes the token access.
 * 
 * @param userId - The id of the user that the token is attached
 * to.
 * @returns - The revoked token object from prisma's ORM.
 */
const revokeTokens = async (userId: string) => {
  return db.refreshToken.updateMany({
    where: {
      userId: userId,
    },
    data: {
      revoked: true,
    },
  })
}

const authServices = {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword,
  addRefreshTokenToWhiteList,
  findRefreshToken,
  deleteRefreshTokenById,
  revokeTokens,
}

export default authServices