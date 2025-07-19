import axiosClient from "./client"

/**
 * This function makes a GET request for all commandBot's GET request, and returns
 * the information that was asked to fetch, returns an error message if nothing is
 * found.
 * 
 * @param userId - The id of the user making the request.
 * @param classId - The id of the class from the commandBot
 * @param matchedSentence - The sentence used to find the url
 * @param params - The params that will be placed in the url.
 */
const fetchCommandBotInformation = async (
  userId: string,
  classId: string,
  route: string,
  params: string[]
) => {
  route = route.replace(':userId', userId).replace(':classId', classId)
  const placeholderRegex = /:([a-zA-Z0-9_]+)/g
  let paramIndex = 0;
  route = route.replace(placeholderRegex, (match) => {
    if (match === ':userId' || match === ':classId') return match
    let value = params[paramIndex++]
    if (value !== undefined) {
      value = value.replace(/^['"]|['"]$/g, '')
      return value
    }
    return match
  })
  route = '/api' + route
  const response = await axiosClient.get<any>(
    route,
    { headers: { 
      'Content-Type': 'application/json' 
      },
      withCredentials: true 
    }
  )
  console.log('here')
  console.log(response)
}

const chattingApi = {
  fetchCommandBotInformation
}

export default chattingApi