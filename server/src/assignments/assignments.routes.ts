import express from 'express'
import { prisma } from '../context/context'
import { authenticateToken } from '../auth/auth.jwt'
import multer from 'multer'
import classService from '../classes/classes.services'
import assignmentUtils from './assignments.utils'
import assignmentServices from './assignments.services'
import authServices from '../auth/auth.services'
import { CommandCategory, NotificationType, UserRole } from '@prisma/client'
import notificationsUtils from '../notifications/notifications.utils'

const router = express.Router()
const ctx = { prisma }
const upload = multer({ dest: 'uploads/assignments'})
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * This POST route handles the creation of a new assignment in a class. It verifies
 * if the creator is a professor, it verifies if there are any files associated, 
 * uploades them to the GCP bucket, and creates the assignment with the rest of the
 * information provided.
 */
router.post('/:userId/class/:classId/assignment', upload.array('files'), authenticateToken, async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data)
    const { assignmentName, assignmentDescription, dueDate } = data
    const classId = req.params.classId
    const userId = req.params.userId

    const currClass = await classService.findProfessorByClassId(classId, ctx)
    if (currClass?.professor.id !== userId) {
      res.status(400).json({message: "Only the professor of this course can create an assignment"})
      throw new Error('Only the professor of this course can create an assignment')
    }

    let filesUrls
    const files = req.files as Express.Multer.File[]
    if (files !== undefined && files.length > 0) {
      filesUrls = await assignmentUtils.uploadAssignmentFiles(files, assignmentName)
    }

    const newAssignment = await assignmentServices.createNewAssignment(
      assignmentName,
      assignmentDescription,
      classId,
      new Date(dueDate),
      filesUrls || undefined,
      ctx
    )

    await notificationsUtils.createNotificationAsProfessor(
      userId,
      classId,
      NotificationType.AssignmentPosted,
      newAssignment,
      res
    )

    const updatedAssignmentsList = await assignmentServices.findAllAssignmentsByClassId(
      null,
      classId,
      ctx
    )

    res.status(200).json({updatedAssignmentsList: updatedAssignmentsList})
  } catch (error) {
    console.error(error)
  }
})

/**
 * This GET route is used to get the assignment information necessary. If the user making
 * this request is a student, only the assignment information alongside the submission files
 * are returned. If the professor is making this request, all the assignments information,
 * all submission information, and the student's name associated with the submission is returned.
 */
router.get('/:userId/class/:classId/assignment/:assignmentId', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const assignmentId = req.params.assignmentId
    const currUser = await authServices.findUserById(userId, ctx)
    const submission = req.query.submission
    let assignmentName = ''
    let assignmentWithSubmissions
    if (uuidRegex.test(assignmentId)) {
      if (currUser?.accountType === UserRole.Professor) {
        assignmentWithSubmissions = await assignmentServices.findAllSubmissionByAssignmentId(
          assignmentId,
          ctx  
        )
      } else {
       assignmentWithSubmissions = await assignmentServices.findAssignmentById(
          userId,
          assignmentId,
          ctx  
        )
      }
    } else {
      assignmentName = assignmentId
      if (currUser?.accountType === UserRole.Professor) {
        assignmentWithSubmissions = await assignmentServices.findAllSubmissionsByAssignmentName(
          assignmentName,
          ctx  
        )
      } else {
        assignmentWithSubmissions = await assignmentServices.findAssignmentByName(
          userId,
          assignmentName,
          ctx  
        )
      }
    }
    if (!assignmentWithSubmissions) {
      res.status(200).json({errorMessage: 'Could not find any assignment with the name provided'})
      return 
    }
    const category = (submission !== undefined) ? CommandCategory.ViewStudentSubmission : CommandCategory.ViewAssignment
    assignmentName.length > 0 ? res.status(200).json({
      commandBotData: assignmentWithSubmissions, 
      commandCategory: category
    }) : res.status(200).json({assignmentWithSubmissions: assignmentWithSubmissions})
    return
  } catch (error) {
    console.error(error)
  }
})

/**
 * This GET route returns a list of all the assignments related to the class. The same
 * information is returned regardless whether the user is a sudent or a professor.
 */
router.get('/:userId/class/:classId/assignment', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const classId = req.params.classId

    const currUser = await authServices.findUserById(userId, ctx)
    if (currUser?.accountType === UserRole.Professor) {
      const assignments = await assignmentServices.findAllAssignmentsByClassId(
        null,
        classId,
        ctx
      )
      res.status(200).json({assignments: assignments})
    } else {
      const assignments = await assignmentServices.findAllAssignmentsByClassId(
        userId,
        classId,
        ctx
      )
      res.status(200).json({assignments: assignments})
    }
  } catch (error) {
    console.error(error)
  }
})

export default router