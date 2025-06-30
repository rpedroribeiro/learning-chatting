import express from 'express'
import classService from './classes.services'
import classUtils from './classes.utils'
import authServices from '../auth/auth.services'
import authJwt from '../auth/auth.jwt'

const router = express.Router()
const authenticateToken = authJwt.authenticateToken

/**
 * This route creates a new class for a professor and validates
 * if the desired times for the class fits inside the professor's
 * current schedule. 
 */
router.post('/:userId/class', async (req, res, next) => {
  try {
    const { sectionId, startTime, endTime, days } = req.body
    const professorId = req.params.userId
    const [classValid, validationMessage] = await classUtils.checkValidClassTimes(
      professorId,
      days,
      startTime,
      endTime
    )

    if (!classValid) {
      res.status(400).json({message: validationMessage})
      throw new Error(validationMessage)
    }

    let startTimeList = []
    let endTimeList = []
    for (const day of days) {
      const currDay = classUtils.weekdayMapping[day]
      startTimeList.push(new Date(`2001-01-${String(currDay).padStart(2, '0')}T${startTime}:00`))
      endTimeList.push(new Date(`2001-01-${String(currDay).padStart(2, '0')}T${endTime}:00`))
    }

    const newClass = await classService.createClass(
      sectionId,
      startTimeList,
      endTimeList,
      professorId
    )
    
    res.status(200).json({newClass: newClass})
  } catch (error) {
    next(error)
  }
})

/**
 * This route retrieves a list of all classes that the user is
 * currently enrolled in, regardless if the user is a student or a
 * professor. 
 */
router.get('/:userId/class', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.userId
    const validUser = await authServices.findUserById(userId)

    if (!validUser) {
      res.status(400).json({message: "User does not exist"})
      throw new Error("User does not exist")
    }

    let classList
    if (validUser.accountType === "Student") {
      classList = await classService.findAllClassesByStudentId(userId)
    } else {
      classList = await classService.findAllClassesByProfessorId(userId)
    }

    res.status(200).json({classList: classList})
  } catch (error) {
    next(error)
  }
})

/**
 * This route updates a class by putting a student into the class' 
 * student list and also puts the class into the student's class list.
 */
router.put('/:userId/class', authenticateToken, async (req, res, next) => {
  try {
    const { courseCode } = req.body
    const studentId = req.params.userId

    const validUser = await authServices.findUserById(studentId)
    if (!validUser) {
      res.status(400).json({message: "User does not exist"})
      throw new Error("User does not exist")
    }

    const validClass = await classService.findClassByClassCode(courseCode)
    if (!validClass) {
      res.status(400).json({message: "Class does not exist"})
      throw new Error("Class does not exist")
    }

    const studentClass = await classService.addStudentToClass(validClass.id, studentId)
    res.status(200).json({studentClass: studentClass})
  } catch (error) {
    next(error)
  }
})

/**
 * This route will open up all the information related to the classroom that
 * the user is currently enrolled in, regardless of their role. The params
 * include the userId and the desired class' classId.
 */
router.get('/:userId/class/:classId', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.boardId
    const classId = req.params.classId

    const currUser = await authServices.findUserById(userId)
    if (!currUser) {
      res.status(400).json({message: "User does not exist"})
      throw new Error("User does not exist")
    }

    let studentId = null
    let professorId = null
    if (currUser.accountType === "Student") { studentId = userId }
    else if (currUser.accountType === "Professor") { professorId = userId }


    const selectedClass = await classService
      .findClassByUserIdAndClassId(classId, studentId, professorId)

    res.status(200).json({class: selectedClass})
  } catch (error) {
    next(error)
  }
})

export default router