import express from 'express'
import { prisma } from '../context/context'
import { authenticateToken } from '../auth/auth.jwt'
import multer from 'multer'
import classService from '../classes/classes.services'
import assignmentUtils from './assignments.utils'
import assignmentServices from './assignments.services'

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
})