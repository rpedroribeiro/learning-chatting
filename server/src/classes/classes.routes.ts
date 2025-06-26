import express from 'express'
import classService from './classes.services'
import classUtils from './classes.utils'
import authServices from '../auth/auth.services'

const router = express.Router()

/**
 * This route creates a new class for a professor and validates
 * if the desired times for the class fits inside the professor's
 * current schedule. 
 */
router.post('/class', async (req, res, next) => {
  try {
    const { sectionId, startTime, endTime, days, professorId } = req.body
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
    
    res.status(200).json({classroom: newClass})
  } catch (error) {
    next(error)
  }
})

/**
 * This route retrieves a list of all classes that the user is
 * currently enrolled in, regardless if the user is a student or a
 * professor. 
 */
router.get('/class', async (req, res, next) => {
  try {
    const { userId } = req.body
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

export default router