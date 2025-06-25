/**
 * The function takes in a password and checks if the 
 * password passes the strength requirements.
 * 
 * @param password - The password we want to verify.
 * @returns A boolean that represents if the password has
 * been verified and an error message.
 */
const checkPasswordStrength = (password: string): [boolean, string] => {
  const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  if (password.length < 8) return [false, "Password Must Be 8 Characters Long"]
  if (password === password.toLowerCase()) return [false, "Password Must Contain One Uppercase Character"]
  if (!specialCharacters.test(password)) return [false, "Password Must Contain One Special Character"]
  return [true, 'it worked']
}

const passwordUtils = {
  checkPasswordStrength
}

export default passwordUtils