import express from 'express'
import { prisma } from '../context/context'
import { authenticateToken } from '../auth/auth.jwt'
import authServices from '../auth/auth.services'
import { NotificationType, UserRole } from '@prisma/client'
import classService from '../classes/classes.services'
import notificationServices from './notifications.services'

const router = express.Router()
const ctx = { prisma }

router.post('/:userId/class/:classId/notifications', authenticateToken, async (req, res, next) => {
  try {
    const { data, notificationType } = req.body
    const userId = req.params.userId
    const classId = req.params.classId

    const notificationCreator = await authServices.findUserById(
      userId, 
      ctx
    )
    if (!notificationCreator) {
      res.status(400).json({message: "User does not exist"})
      throw new Error('User does not exist')
    }

    if (notificationCreator.accountType === UserRole.Student) {
      const user = await classService.findProfessorByClassId(
        classId,
        ctx
      )
      if (!user) {
        res.status(400).json({message: "User does not exist"})
        throw new Error('User does not exist')
      }
      if ([
        NotificationType.AnnouncementPosted, 
        NotificationType.AssignmentPosted, 
        NotificationType.FileSystemItemCreated].includes(notificationType)
      ) {
        res.status(400).json({message: "This notification can only be made by a professor"})
        throw new Error('This notification can only be made by a professor')
      }
      await notificationServices.createNotification(
        userId,
        classId,
        notificationType,
        data,
        [user.professor],
        ctx
      )
    } else {
      const users = await classService.findAllStudentsByClassId(
        classId,
        ctx
      )
      if (!users) {
        res.status(400).json({message: "Users do not exist"})
        throw new Error('Users do not exist')
      }
      if ([NotificationType.StudentSubmission].includes(notificationType)) {
        res.status(400).json({message: "This notification can only be made by a student"})
        throw new Error('This notification can only be made by a student')
      }
      await notificationServices.createNotification(
        userId,
        classId,
        notificationType,
        data,
        users.students,
        ctx
      )
    }
  } catch (error) {
    console.error(error)
  }
})