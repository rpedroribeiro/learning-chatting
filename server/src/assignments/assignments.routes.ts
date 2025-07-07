import express from 'express'
import { prisma } from '../context/context'
import { authenticateToken } from '../auth/auth.jwt'
import multer from 'multer'
import classService from '../classes/classes.services'
import assignmentUtils from './assignments.utils'
import assignmentServices from './assignments.services'
import submissionServices from './submission.services'
import authServices from '../auth/auth.services'
import { UserRole } from '@prisma/client'
import gcpBucketUtils from '../gcpbucket/gcpbucket.utils'

const router = express.Router()
const ctx = { prisma }
const upload = multer({ dest: 'uploads/assignments'})

/**
 * This POST route handles the creation of a new assignment in a class. It verifies
 * if the creator is a professor, it verifies if there are any files associated, 
 * uploades them to the GCP bucket, and creates the assignment with the rest of the
 * information provided.
 */
router.post('/:userId/class/:classId/assignment', upload.array('uploadedFiles'), authenticateToken, async (req, res, next) => {
  try {
    const { assignmentName, assignmentDescription, dueDate } = req.body
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
      dueDate,
      filesUrls || undefined,
      ctx
    )

    res.status(200).json({assignment: newAssignment})
  } catch (error) {
    console.error(error)
  }
})

/**
 * This POST request uploads files the student inputed into their submissions instance
 * and also adds them to the GCP bucket. This route does not submit the assignment, but
 * rather gets the files ready for when the assignment is submitted. This request cannot be
 * made once the submission is submitted.
 */
router.post('/:userId/class/:classId/assignment/:assignmentId/uploadfiles', upload.single('uploadedFiles'), authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const assignmentId = req.params.assignmentId

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

    const filePath = file.path

    const submission = await submissionServices.uploadSubmissionFile(
      userId,
      assignmentId,
      filePath,
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
 * 
 */
router.put('/:userId/class/:classId/assignment/:assignmentId/submit', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const assignmentId = req.params.assignmentId

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

    const updatedSubmission = await submissionServices.updateSubmissionStatus(
      userId,
      assignmentId,
      ctx
    )

    res.status(200).json({submission: updatedSubmission})
  } catch (error) {
    console.error(error)
  }
})