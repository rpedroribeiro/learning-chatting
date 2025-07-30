import type { UserRole } from "../utils/UserRole";
import axiosClient from "./client"

type accountCreationParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: UserRole | null;
}

type logInParams = {
  email: string;
  password: string;
}

type authResponse = {
  userId: string;
  message: string;
  accountType: UserRole | null;
  profileImg: string;
}

type logOutResponse = {
  message: string
}

type updateProfileResponse = {
  updatedProfilePictureUrl: string
}

/**
 * This function takes in the data from the account creation form and 
 * passes the information into a POST request to create an account.
 * 
 * @param param0 - All the user data needed to pass into the POST request 
 * @returns - The access token supplied or error message along with boolean status
 */
const createAccount = async ({
  firstName,
  lastName,
  email, 
  password,
  accountType
}: accountCreationParams): Promise<[boolean, string, string, UserRole | null, string]> => {
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
    const profileImg: string = response.data.profileImg
    return [true, message, userId, accountType, profileImg]
  } catch (error: any) {
    console.error(error)
    return [false, String(error.response.data.message), "", accountType, ""]
  }
}

/**
 * This function takes in the data from the log in form and 
 * passes the information into a POST request to log the user in.
 * 
 * @param param0 - All the user data needed to pass into the POST request 
 * @returns - The access token supplied or error message along with boolean status
 */
const signIntoAccount = async ({email, password}: logInParams): Promise<[boolean, string, string, UserRole | null, string]> => {
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
    const accountType = response.data.accountType
    const profileImg: string = response.data.profileImg
    return [true, message, userId, accountType, profileImg]
  } catch (error: any) {
    console.error(error)
    return [false, String(error.response.data.message), "", null, ""]
  }
}

/**
 * This function logs out the user by sending the accessToken and refreshToken
 * to the server. The server will then revoke the clients access to both tokens
 * by removing them from the cookies.
 * 
 * @returns A message that either states the user was logged out or
 * an error message
 */
const logOutAccount = async () => {
  try {
    const response = await axiosClient.post<logOutResponse>(
      '/api/auth/logout',
      {},
      { headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
      }
    )
    const message = response.data.message
    return message
  } catch (error) {
    console.error(error)
  }
}

/**
 * This function updates the profile picture field of the user currently logged in
 * by sending a PUT request.
 * 
 * @param userId - The id of the user updating their profile picture.
 * @param file - The file that will be their new profile picture.
 * @returns The new signed url to be used to display the change.
 */
const updateProfilePicture = async (
  userId: string,
  file: File
) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axiosClient.put<updateProfileResponse>(
      `/api/${userId}/updatePic`,
      formData,
      { withCredentials: true }
    )
    return response.data.updatedProfilePictureUrl
  } catch (error) {
    console.error(error)
  }
}

const authApi = {
  createAccount,
  signIntoAccount,
  logOutAccount,
  updateProfilePicture
}

export default authApi