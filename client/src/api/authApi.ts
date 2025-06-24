import axiosClient from "./client"

type accountCreationParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * This function takes in the data from the account creation form and 
 * passes the information into a POST request to create an account.
 * 
 * @param param0 - All the user data needed to pass into the POST request 
 * @returns - The access token supplied by the server
 */
const createAccount = ({firstName, lastName, email, password}: accountCreationParams): string => {
  axiosClient.post(
      '/api/auth/register',
      { firstName, lastName, email, password },
      { headers: { 'Content-Type': 'application/json' } }
    )
  .then(res => {
    const { accessToken } = res.data as { accessToken: string }
    return accessToken
  })
  return ''
}

const authApi = {
  createAccount
}

export default authApi