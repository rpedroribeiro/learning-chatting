import chattingUtils from "../utils/chattingUtils"
import axiosClient from "./client"

type fetchCommandBotResponse = {
  commandBotData: any
}

type putCommandBotResponse = {
  commandBotUpdate: any
}

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
  params: string[],
) => {
  const finalRoute = chattingUtils.fillOutRoute(
    userId,
    classId,
    route,
    params
  )
  const response = await axiosClient.get<fetchCommandBotResponse>(
    finalRoute,
    { headers: { 
      'Content-Type': 'application/json' 
      },
      withCredentials: true 
    }
  )
  return response.data.commandBotData
}

/**
 * This function makes a PUT request for all commandBot's PUT request, and returns
 * the information that was asked to fetch, returns an error message if nothing is
 * found.
 * 
 * @param userId - The id of the user making the request.
 * @param classId - The id of the class from the commandBot
 * @param matchedSentence - The sentence used to find the url
 * @param params - The params that will be placed in the url.
 */
const putCommandBotInformation = async (
  userId: string,
  classId: string,
  route: string,
  params: string[],
) => {
  const finalRoute = chattingUtils.fillOutRoute(
    userId,
    classId,
    route,
    params
  )
  const response = await axiosClient.put<fetchCommandBotResponse>(
    finalRoute,
    {},
    { headers: { 
      'Content-Type': 'application/json' 
      },
      withCredentials: true 
    }
  )
  return response.data.commandBotData
}

const chattingApi = {
  fetchCommandBotInformation,
  putCommandBotInformation
}

export default chattingApi