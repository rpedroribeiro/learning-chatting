import express from 'express'
import { prisma } from '../context/context'
import { authenticateToken } from '../auth/auth.jwt'
import multer from 'multer'
import submissionServices from './submission.services'
import authServices from '../auth/auth.services'
import { NotificationType, UserRole } from '@prisma/client'
import gcpBucketUtils from '../gcpbucket/gcpbucket.utils'
import submissionUtils from './submission.utils'
import assignmentServices from '../assignments/assignments.services'
import notificationsUtils from '../notifications/notifications.utils'

const router = express.Router()
const ctx = { prisma }
const upload = multer({ dest: 'uploads/submissions'})
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * This POST request uploads files the student inputed into their submissions instance
 * and also adds them to the GCP bucket. This route does not submit the assignment, but
 * rather gets the files ready for when the assignment is submitted. This request cannot be
 * made once the submission is submitted.
 */
router.post('/:userId/class/:classId/assignment/:assignmentId/uploadfiles', upload.single('file'), authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const assignmentId = req.params.assignmentId

    const assignment = await assignmentServices.findAssignmentById(
      userId,
      assignmentId,
      ctx
    )

    if (!assignment) {
      res.status(400).json({message: "Assignment requested does not exist"})
      throw new Error('Assignment requested does not exist')
    }
    
    const assignmentName = assignment?.name
    const currSubmission = await submissionServices.findSubmissionWithUserIdAndAssignmentId(
      userId,
      assignmentId,
      ctx
    )

    if (currSubmission?.submitted === true) {
      res.status(400).json({message: "Cannot make this request when assignment is already submitted"})
      throw new Error('Cannot make this request when assignment is already submitted')
    }

    const currUser = await authServices.findUserById(userId, ctx)
    if (!currUser || currUser.accountType !== UserRole.Student) {
      res.status(400).json({message: "User is not a student or does not exist"})
      throw new Error('User is not a student or does not exist')
    }

    const file = req.file
    if (!file) {
      res.status(400).json({message: "No file sent on request"})
      throw new Error('No file sent on request')
    }

    const dbFilePath = await submissionUtils.uploadSubmissionFiles(
      file,
      assignmentName,
      currUser.firstName,
      currUser.lastName,
    )

    const submission = await submissionServices.uploadSubmissionFile(
      userId,
      assignmentId,
      dbFilePath,
      ctx
    )

    res.status(200).json({submission: submission})
  } catch (error) {
    console.error(error)
  }
})

/**
 * This DELETE requeest removes the desired filed from the list of uplaoded files from
 * both the submission instance in the db and also in the GCP bucket. This request cannot
 * be made once the submission is submitted.
 */
router.delete('/:userId/class/:classId/assignment/:assignmentId/uploadfiles', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const assignmentId = req.params.assignmentId
    const { filePath } = req.body

    const currSubmission = await submissionServices.findSubmissionWithUserIdAndAssignmentId(
      userId,
      assignmentId,
      ctx
    )

    if (currSubmission?.submitted === true) {
      res.status(400).json({message: "Cannot make this request when assignment is already submitted"})
      throw new Error('Cannot make this request when assignment is already submitted')
    }

    const currUser = await authServices.findUserById(userId, ctx)
    if (!currUser || currUser.accountType !== UserRole.Student) {
      res.status(400).json({message: "User is not a student or does not exist"})
      throw new Error('User is not a student or does not exist')
    }

    await gcpBucketUtils.deleteObjectFromBucket(filePath)

    const updatedSubmission = await submissionServices.deleteSubmissionFile(
      userId,
      assignmentId,
      filePath,
      ctx
    )

    if (updatedSubmission === null) {
      res.status(400).json({message: "Issue removing the file from the submission"})
      throw new Error('Issue removing the file from the submission')
    }

    res.status(200).json({submission: updatedSubmission})
  } catch (error) {
    console.error(error)
  }
})

/**
 * This PUT request updates the submission status of the student's submission of the current assignement
 * opened. It makes sure the user sending this request is a student and that the student has not already
 * submitted the assignment.
 */
router.put('/:userId/class/:classId/assignment/:assignmentId/submit', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.userId
    let assignmentId = req.params.assignmentId
    const classId = req.params.classId

    let currSubmission
    if (uuidRegex.test(assignmentId)) {
      currSubmission = await submissionServices.findSubmissionWithUserIdAndAssignmentId(
        userId,
        assignmentId,
        ctx
      )
    } else {
      const assignmentName = assignmentId
      const result = await submissionServices.findSubmissionWithUserIdAndAssignmentName(
        userId,
        assignmentName,
        ctx
      )
      if (result) {
        assignmentId = result.id
        currSubmission = result.submisison
      } else {
        res.status(400).json({message: "Cannot find the submission"})
        throw new Error('Cannot find the submission')
      }
    }

    if (currSubmission?.submitted === true) {
      res.status(400).json({message: "Cannot make this request when assignment is already submitted"})
      throw new Error('Cannot make this request when assignment is already submitted')
    }

    const currUser = await authServices.findUserById(userId, ctx)
    if (!currUser || currUser.accountType !== UserRole.Student) {
      res.status(400).json({message: "User is not a student or does not exist"})
      throw new Error('User is not a student or does not exist')
    }

    const updatedSubmission = await submissionServices.updateSubmissionStatus(
      userId,
      assignmentId,
      ctx
    )

    const notificationData = await submissionServices.getNotificationSubmissionData(
      userId,
      assignmentId,
      ctx
    )

    await notificationsUtils.createNotificationAsStudent(
      userId,
      classId,
      NotificationType.StudentSubmission,
      notificationData,
      res
    )

    res.status(200).json({submission: updatedSubmission})
  } catch (error) {
    console.error(error)
  }
})

/**
 * This GET request uses a GCP bucket util funciton to get the url needed
 * to access the file in the client side using the file's path.
 */
router.get('/:userId/class/:classId/assignment/:assignmentId/url', authenticateToken, async (req, res, next) => {
  try {
    const { file } = req.query
    const url = await gcpBucketUtils.generateV4ReadSignedUrl(String(file))
    res.status(200).json({url: url})
  } catch (error) {
    console.error(error)
  }
})

export default router