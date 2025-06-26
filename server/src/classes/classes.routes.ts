import express from 'express'
import classService from './classes.services'
import classUtils from './classes.utils'

const router = express.Router()

router.post('/class', async (req, res, next) => {
  try {
    const { sectionId, startTime, endTime, days, professorId } = req.body
    
    
    // const classroom = await classroomServices.createClassroom(
    //   sectionId,
    //   startTime,
    //   endTime,
    //   days,
    //   professorId
    // )
    // res.status(200).json({classroom: classroom})
  } catch (error) {
    next(error)
  }
})