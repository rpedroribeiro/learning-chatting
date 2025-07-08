import axiosClient from "./client"

type getAllAssignmentsResponse = {
  assignments: any
}

type createAssignmentResponse = {
  updatedAssignmentsList: any
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

/**
 * This functions makes a POST request to create a new assignment in the 
 * database and to store all the files in the GCP bucket. It returns the 
 * updated assignment list if successful, else it will return null.
 * 
 * @param userId - The id of the professor creating the assignment.
 * @param classId - The id of the class where the assignment will be made.
 * @param assignmentName - The desired name of the assignment.
 * @param assignmentDescription - The desired description of the assignment.
 * @param dueDate - The desired due date of the assignment.
 * @param files - The desired helper files of the assignment.
 */
const createAssignment = async (
  userId: string,
  classId: string,
  assignmentName: string,
  assignmentDescription: string,
  dueDate: string,
  files: File[]
): Promise<any | null> => {
  try {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    const jsonBody = JSON.stringify({
      assignmentName,
      assignmentDescription,
      dueDate
    })
    formData.append('data', jsonBody)
    const response = await axiosClient.post<createAssignmentResponse>(
      `api/${userId}/class/${classId}/assignment`,
      formData,
      { withCredentials: true }
    ) 
    const newAssignmentList = response.data.updatedAssignmentsList
    return newAssignmentList
  } catch (error) {
    console.error(error)
    return null
  }
}

const assignmentsApi = {
  getAllAssignmentsByClassId,
  createAssignment
}

export default assignmentsApi