import authServices from "../auth/auth.services"

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

const weekdayMapping = {
  "Sunday": 0,
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thurdsay": 4,
  "Friday": 5,
  "Saturday": 6,
}

const checkValidClassTimes = async (userId: string): Promise<[boolean, string]> => {
  const user = await authServices.findUserById(userId)
  if (user) {
    
    return [false, 'f']
  } else {
    return [false, "User does not exist"]
  }
}

const classUtils = {
  generateClassId,
  weekdayMapping
}

export default classUtils