import express from 'express'
import { prisma } from '../context/context'
import { authenticateToken } from '../auth/auth.jwt'
import authServices from '../auth/auth.services'
import { NotificationType, UserRole } from '@prisma/client'
import classService from '../classes/classes.services'
import notificationServices from './notifications.services'
import notificationsUtils from './notifications.utils'

const router = express.Router()
const ctx = { prisma }

/**
 * This GET route fetches all notifications from a specific category provided
 * for a user in a class, only the notifications that were made inside that class
 * are returned.
 */
router.get('/:userId/class/:classId/notifications', authenticateToken, async (req, res, next) => {
  try {
    const { notificationType } = req.body
    const userId = req.params.userId
    const classId = req.params.classId

    const notifications = await notificationServices.getAllNotificationsForCategoryForUser(
      userId,
      classId,
      notificationType,
      ctx
    )

    res.status(200).json({notifications: notifications})
  } catch (error) {
    console.error(error)
  }
})

/**
 * This POST request creates a new notification and links it with the creator and
 * all of the receivers, it is also given a category and meta data to go alongside
 * the request.
 */
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

    notificationCreator.accountType === UserRole.Student ? 
    notificationsUtils.createNotificationAsStudent(
      userId,
      classId,
      notificationType,
      data,
      res
    ) : notificationsUtils.createNotificationAsProfessor(
      userId,
      classId,
      notificationType,
      data,
      res
    )
  } catch (error) {
    console.error(error)
  }
})

/**
 * This PUT request updates a notification to be read using the notification id
 * provided.
 */
router.put('/:userId/class/:classId/notifications/:notificationId', authenticateToken, async (req, res, next) => {
  try {
    const notificationId = req.params.notificationId
    const updatedNotification = await notificationServices.markNotificationAsRead(
      notificationId,
      ctx
    )
    res.status(200).json({updatedNotification: updatedNotification})
  } catch (error) {
    console.error(error)
  }
})

export default router