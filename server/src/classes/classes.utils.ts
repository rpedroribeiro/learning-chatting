import { start } from "repl"
import authServices from "../auth/auth.services"

interface Dictionary {
  [key: string]: any
}

/**
 * This function generates the a six character long class
 * id randomly generated from alphabetic characters and 
 * numbers
 * 
 * @returns The generated class code
 */
const generateClassId = (): string => {
  let result = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 6; i++) {
    result += characters[Math.floor(Math.random() * characters.length)]
  }
  return result
}

/**
 * This dictionary maps out the day of the week to a
 * number that the Date object can comprehend.
 */
const weekdayMapping: Dictionary = {
  "Sunday": 1,
  "Monday": 2,
  "Tuesday": 3,
  "Wednesday": 4,
  "Thursday": 5,
  "Friday": 6,
  "Saturday": 7,
}

/**
 * This function takes four different times, two are the desired
 * times to add, the other two are existing, and a boolean determining
 * if you can add the class.
 * 
 * @param startA - Class to add start time.
 * @param endA - Class to add end time.
 * @param startB - Existing cllass start time.
 * @param endB - Existing class end time.
 * @returns - boolean determining if you can add the class to the schedule.
 */
const isTimeConflict = (startA: Date, endA: Date, startB: Date, endB: Date): boolean => {
  return startA < endB && endA > startB
}

/**
 * This function takes in all current classes, the time for the desired
 * class to be added, and the day the desired class occurs in. The
 * function then loops through all existing classes and uses the helper
 * function isTimeConflict() to determing if it is possible to add the class.
 * 
 * @param classes - Classes that either the student or professor are
 * endrolled in.
 * @param days - The days of the week the class takes place.
 * @param startTime - The start time of the class.
 * @param endTime - The end time of the class.
 * @returns - A boolean alongside a message if there is a conflict.
 */
const checkConflicts = (
  classes: any[], 
  days: string[],
  startTime: string,
  endTime: string,
): [boolean, string] => {
  for (const day of days) {
    const currDay = weekdayMapping[day]
    const startDate = new Date(`2001-01-${String(currDay).padStart(2, '0')}T${startTime}:00`)
    const endDate = new Date(`2001-01-${String(currDay).padStart(2, '0')}T${endTime}:00`)
    for (const currClass of classes) {
      for (let i = 0; i < currClass.startTimes.length; i++) {
        const classStart = new Date(currClass.startTimes[i])
        const classEnd = new Date(currClass.endTimes[i])
        if (classStart.getDay() === startDate.getDay() &&
          isTimeConflict(startDate, endDate, classStart, classEnd)
        ) {
          return [false, "Other Classes Block You From Taking This Class"]
        }
      }
    }
  }
  return [true, ""]
}

/**
 * This function takes the necessary information from the user to determine
 * if the class the user desires to participate in fits their schedule. The 
 * function also uses additional helper function like checkConflicts() and 
 * isTimeConfict() to determine.
 * 
 * @param userId - The user Id for the person wanting to add the class.
 * @param days - The days of the week the desired class takes place.
 * @param startTime - The start time of the desired class.
 * @param endTime - The end time of the desired class.
 * @returns - A boolean alongside a message if there is a conflict.
 */
const checkValidClassTimes = async (
  userId: string,
  days: string[],
  startTime: string,
  endTime: string
): Promise<[boolean, string]> => {
  const user = await authServices.findUserById(userId)
  if (!user) {
    return [false, "User does not exist"]
  }
  if (user.accountType === "Student") {
    return checkConflicts(user.studentClasses, days, startTime, endTime)
  } else if (user.accountType === "Professor") {
    return checkConflicts(user.professorClasses, days, startTime, endTime)
  } else {
    return [false, "Unknown account type"]
  }
}

const classUtils = {
  generateClassId,
  checkValidClassTimes,
  weekdayMapping
}

export default classUtils