import { NotificationType } from "@prisma/client"
import { prisma } from "../context/context"
import classService from "../classes/classes.services"
import notificationServices from "./notifications.services"
import { Response } from "express"

const ctx = { prisma }

/**
 * This function checks for any validation errors before creating the notification
 * with the student as the creator and the professor of the class as the
 * receiver.
 * 
 * @param studentId - The id of the student creating the assignment
 * @param classId - The id of the class where the notification is poster
 * @param notificationType - The type of notification being posted.
 * @param data - All the meta data used in the request
 * @param res - The response of the request made in the route.
 */
const createNotificationAsStudent = async (
  studentId: string,
  classId: string,
  notificationType: any,
  data: any,
  res: Response,
) => {
  try {
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
      studentId,
      classId,
      notificationType,
      data,
      [user.professor],
      ctx
    )
  } catch (error) {
    console.error(error)
  }
}

/**
 * This function checks for any validation errors before creating the notification
 * with the professor as the creator and all the students in a class as the 
 * receivers.
 * 
 * @param professorId - The id of the professor creating the assignment
 * @param classId - The id of the class where the notification is poster
 * @param notificationType - The type of notification being posted.
 * @param data - All the meta data used in the request
 * @param res - The response of the request made in the route.
 */
const createNotificationAsProfessor = async (
  professorId: string,
  classId: string,
  notificationType: any,
  data: any,
  res: Response,
) => {
  try {
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
      professorId,
      classId,
      notificationType,
      data,
      users.students,
      ctx
    )
  } catch (error) {
    console.error(error)
  }
}

const notificationsUtils = {
  createNotificationAsProfessor,
  createNotificationAsStudent
}

export default notificationsUtils