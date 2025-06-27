import axiosClient from "./client"

type accountCreationParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: string;
}

type logInParams = {
  email: string;
  password: string;
}

type authResponse = {
  userId: string;
  message: string;
}

/**
 * This function takes in the data from the account creation form and 
 * passes the information into a POST request to create an account.
 * 
 * @param param0 - All the user data needed to pass into the POST request 
 * @returns - The access token supplied or error message along with boolean status
 */
const createAccount = async ({firstName, lastName, email, password, accountType}: accountCreationParams): Promise<[boolean, string, string]> => {
  try {
    const response = await axiosClient.post<authResponse>(
      '/api/auth/register',
      { firstName, lastName, email, password, accountType},
      { headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
      }
    )
    const userId: string = response.data.userId
    const message: string = response.data.message
    return [true, message, userId]
  } catch (error: any) {
    console.error(error)
    return [false, String(error.response.data.message), ""]
  }
}

/**
 * This function takes in the data from the log in form and 
 * passes the information into a POST request to log the user in.
 * 
 * @param param0 - All the user data needed to pass into the POST request 
 * @returns - The access token supplied or error message along with boolean status
 */
const signIntoAccount = async ({email, password}: logInParams): Promise<[boolean, string, string]> => {
  try {
    const response = await axiosClient.post<authResponse>(
      '/api/auth/login',
      { email, password },
      { headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
      }
    )
    const message: string = response.data.message
    const userId: string = response.data.userId
    return [true, message, userId]
  } catch (error: any) {
    console.error(error)
    return [false, String(error.response.data.message), '']
  }
}

const authApi = {
  createAccount,
  signIntoAccount
}

export default authApi