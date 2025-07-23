import { CommandCategory } from "./CommandCategory";
import { UserRole } from "./UserRole";

/**
 * This util function takes in the route with the placeholder for the params
 * and fills them out using the user id, the class id, and the rest of the array
 * of params.
 * 
 * @param userId - The id of the user.
 * @param classId - The id of the class the user is currently in.
 * @param route - The route with all the placeholder values.
 * @param record - An record with the key as the param and the value as the input.
 * @returns The new route to be used in an API call.
 */
const fillOutRoute = (
  userId: string,
  classId: string,
  route: string,
  record: Record<string, string>
) => {
  console.log(record)
  route = route.replace(':userId', userId).replace(':classId', classId)
  const placeholderRegex = /:([a-zA-Z0-9_]+)/g
  route = route.replace(placeholderRegex, (match, key) => {
    if (key === 'userId' || key === 'classId') return match
    if (key in record) { return record[key].replace(/^['"]|['"]$/g, '') }
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
  accountType: string,
  data: any,
  commandCategory: CommandCategory,
  params: string[]
): string => {
  switch (commandCategory) {
    case CommandCategory.ViewFileSystemItem:
      return `CommandBot linked the ${data.name} ${data.type.toLowerCase()}`
    case CommandCategory.ViewAssignment:
      return `CommandBot linked the assignment ${data.name} to the chat`
    case CommandCategory.ViewStudentSubmission:
      if (accountType === UserRole.Student) { return `CommandBot linked the submission of assignment ${data.name}` } 
      else { return params.length > 1 ? `CommandBot linked the submission of students for ${data.name}`
      : `CommandBot linked the submission from ${params[params.length - 1]} for ${data.name}`}
  }
  return ""
}

const chattingUtils = {
  fillOutRoute,
  formatCommandBotMessage
}

export default chattingUtils