import * as bcrypt from 'bcrypt'
import { UUID } from 'crypto'
import db from '../database/prisma'

/**
 * This funciton takes in the user email and uses
 * prisma's ORM to return a user object.
 * 
 * @param email - The email of the user.
 * @returns - The user object from the db.
 */
async function findUserByEmail(email: string) {
  return await db.user.findUnique({
    where:{
      email,
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
async function findUserById(id: UUID) {
  return await db.user.findUnique({
    where:{
      id,
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
function createUserByEmailAndPassword(user: any) {
  user.password = bcrypt.hashSync(user.password, 12)
  return db.user.create({
    data: user,
  })
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword
}