import axiosClient from "./client"

type fetchClassesResponse = {
  classList: Object;
}

type addStudentToClassResponse = {
  studentClass: Object;
}

/**
 * 
 * @param param0 
 * @returns 
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
 * 
 * @param userId 
 * @param courseCode 
 * @returns 
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