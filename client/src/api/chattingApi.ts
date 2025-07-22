import chattingUtils from "../utils/chattingUtils"
import { CommandCategory } from "../utils/CommandCategory";
import axiosClient from "./client"

type fetchCommandBotResponse = {
  commandBotData: any;
  commandCategory: CommandCategory;
  errorMessage: string
}

type putCommandBotResponse = {
  commandBotUpdate: any;
  commandCategory: CommandCategory;
  errorMessage: string;
}

/**
 * This function makes a GET request for all commandBot's GET request, and returns
 * the information that was asked to fetch, returns an error message if nothing is
 * found.
 * 
 * @param userId - The id of the user making the request.
 * @param classId - The id of the class from the commandBot
 * @param matchedSentence - The sentence used to find the url
 * @param record - Used to create the route to input the params into the url.
 */
const fetchCommandBotInformation = async (
  userId: string,
  classId: string,
  route: string,
  record: Record<string, string>,
  submission: boolean | undefined
) => {
  const finalRoute = chattingUtils.fillOutRoute(
    userId,
    classId,
    route,
    record
  )
  console.log(finalRoute)
  const response = await axiosClient.get<fetchCommandBotResponse>(
    finalRoute,
    { headers: { 
      'Content-Type': 'application/json' 
      },
      withCredentials: true ,
      params: { submission },
    }
  )
  console.log(response.data.commandBotData)
  if (response.data.errorMessage) { return response.data.errorMessage }
  return [response.data.commandBotData, response.data.commandCategory]
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
  record: Record<string, string>,
) => {
  const finalRoute = chattingUtils.fillOutRoute(
    userId,
    classId,
    route,
    record
  )
  const response = await axiosClient.put<putCommandBotResponse>(
    finalRoute,
    {},
    { headers: { 
      'Content-Type': 'application/json' 
      },
      withCredentials: true 
    }
  )
  if (response.data.errorMessage) { return response.data.errorMessage }
  return [response.data.commandBotUpdate, response.data.commandCategory]
}

const chattingApi = {
  fetchCommandBotInformation,
  putCommandBotInformation
}

export default chattingApi