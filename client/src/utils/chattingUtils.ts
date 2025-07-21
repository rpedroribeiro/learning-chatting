import { CommandCategory } from "./CommandCategory";

/**
 * This util function takes in the route with the placeholder for the params
 * and fills them out using the user id, the class id, and the rest of the array
 * of params.
 * 
 * @param userId - The id of the user.
 * @param classId - The id of the class the user is currently in.
 * @param route - The route with all the placeholder values.
 * @param params - An array of params needed to replace the placeholder values.
 * @returns The new route to be used in an API call.
 */
const fillOutRoute = (
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
  return route
}

/**
 * This util function formats the mssage the command bot displays after the resposne 
 * is fetched depending on the command category.
 * 
 * @param data - The data from the fetched route.
 * @param commandCategory - The command category this falls under.
 * @returns The message to append to the command bot response.
 */
const formatCommandBotMessage = (
  data: any,
  commandCategory: CommandCategory
): string => {
  switch (commandCategory) {
    case CommandCategory.ViewFileSystemItem:
      return `CommandBot linked the ${data.name} ${data.type.toLowerCase()}`
    case CommandCategory.ViewAssignment:
      return `CommanBot linked the assignment ${data.name} to the chat`
  }
return ""
}

const chattingUtils = {
  fillOutRoute,
  formatCommandBotMessage
}

export default chattingUtils