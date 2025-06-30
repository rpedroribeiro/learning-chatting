import axiosClient from "./client"

type fetchClassesResponse = {
  classList: Object;
}

type addStudentToClassResponse = {
  studentClass: Object;
}

/**
 * This function uses the axiosClient to send a GET request to fetch 
 * all classes associated with the user. If the GET request was successful,
 * all classes are returned, if otherwise a error message is returned.
 * 
 * @param param0 - The userId used to fetch all associated classes.
 * @returns - A list of classes, can be null; a status boolean; and a status
 * message.
 */
const fetchClasses = async (
  userId: string
): Promise<[any[] | null, boolean, string]> => {
  try {
    const response = await axiosClient.get<fetchClassesResponse>(
      `/api/${userId}/class`,
      { headers: { 
        'Content-Type': 'application/json' 
        },
        withCredentials: true 
      }
    )
    const classes: any = response.data.classList
    return [classes, true, "Successfuly fetched classes"]
  } catch (error) {
    console.error(error)
    return [null, false, "Failed to fetch classes"]
  }
}

/**
 * This function takes in the userId and the coureCode and sends a PUT
 * request that adds the student to the class list. If the PUT request
 * was succesful, the class enrolled is returned, otherwise an error
 * message will be returned.
 * 
 * @param userId - The id of the student.
 * @param courseCode - The course code of the course the student wants 
 * to enroll in.
 * @returns - The class the student enrolled in, can be null; a status 
 * boolean; and a status message.
 */
const addStudentToCourse = async (
  userId: string, courseCode: string
): Promise<[any[] | null, boolean, string]> => {
  try {
    const response = await axiosClient.put<addStudentToClassResponse>(
      `/api/${userId}/class`,
      { courseCode },
      { headers: { 
        'Content-Type': 'application/json' 
        },
        withCredentials: true 
      }
    )
    const studentClass: any = response.data.studentClass
    return [studentClass, true, "Successfuly added student to class"]
  } catch (error) {
    console.error(error)
    return [null, false, "Failed to add student to class"]
  }
}

const classesApi = {
  fetchClasses,
  addStudentToCourse
}

export default classesApi