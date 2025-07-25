import express from 'express'
import { prisma } from '../context/context'
import authServices from '../auth/auth.services'
import { UserRole } from '@prisma/client'
import chattingServices from './chatting.services'

const router = express.Router()
const ctx = { prisma }

/**
 * This GET route sends back all the information from the class chat obejct.
 */
router.get("/:userId/class/:classId/classChat", async (req, res, next) => {
  try {
    const userId = req.params.userId
    const classId = req.params.classId

    const validUser = await authServices.findUserById(userId, ctx)
    if (validUser?.accountType === UserRole.Student) {
      res.status(400).json({message: "Students cannot create items in the file system"})
      throw new Error('Students cannot create items in the file system')
    }

    const classChat = await chattingServices.fetchClassChat(
      classId,
      ctx
    )

    res.status(200).json({classChat: classChat})
  } catch (error) {
    console.error(error)
  }
})

export default router