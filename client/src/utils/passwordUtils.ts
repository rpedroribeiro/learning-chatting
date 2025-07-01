/**
 * 
 * @param password 
 * @returns 
 */
const checkPasswordLength = (password: string): boolean => {
  return password.length >= 8
}

/**
 * 
 * @param password 
 * @returns 
 */
const checkForUpperCase = (password: string): boolean => {
  return password !== password.toLowerCase()
}

/**
 * 
 * @param password 
 * @returns 
 */
const checkForSpecialCharacter = (password: string): boolean => {
  const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  return specialCharacters.test(password)
}

const passwordUtils = {
  checkPasswordLength,
  checkForUpperCase,
  checkForSpecialCharacter
}

export default passwordUtils