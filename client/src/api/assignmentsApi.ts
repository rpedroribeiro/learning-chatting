import axiosClient from "./client"

type getAllAssignmentsResponse = {
  assignments: any
}

/**
 * This function takes in the users id and the class id to find all the 
 * assignments listed under the class. The function then returns the result
 * along with a status boolean and a message.
 * 
 * @param userId - The id of the user fetching the assignments.
 * @param classId - The id of the class to fetch the assignments from.
 * @returns - A list of all the assignments, a boolean with the status of the
 * request, and a message related to the status.
 */
const getAllAssignmentsByClassId = async (
  userId: string,
  classId: string,
): Promise<[any, boolean, string]> => {
  try {
    const response = await axiosClient.get<getAllAssignmentsResponse>(
      `/api/${userId}/class/${classId}/assignment`,
      { headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
      }
    )
    const assignments = response.data.assignments
    console.log(assignments)
    return [assignments, true, "Successfully fetched all assignments"]
  } catch (error) {
    console.error(error)
    return [null, false, "Failed to fetch assignments"]
  }
}

const assignmentsApi = {
  getAllAssignmentsByClassId
}

export default assignmentsApi