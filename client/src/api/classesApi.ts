import classesUtils from "../utils/classesUtils";
import axiosClient from "./client"

type fetchClassesResponse = {
  classList: Object;
}

type addStudentToClassResponse = {
  studentClass: Object;
}

type createCourseResponse = {
  newClass: Object;
}

type classDetailsResponse = {
  classDetails: Object
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
  userId: string, 
  courseCode: string
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

/**
 * This function takes in all the inputs collected from the form and 
 * sends them in a POST request to create a brand new class for the
 * professor. The cookies containing the refreshToken is also sent.
 * 
 * @param courseName - The desired name of the course.
 * @param userId - The id of the professor.
 * @param sectionId - The desired section id of the course.
 * @param startTime - The time of day the course will start.
 * @param endTime - The time of day the course will end.
 * @param days - The days of the week the course will take place
 * @returns - The newly created object of the course if created, a
 * boolean status of the request, and a status message.
 */
const createCourse = async (
  userId: string,
  courseName: string,
  sectionId: string,
  startTime: string,
  endTime: string,
  daysIndex: string,
): Promise<[any[] | null, boolean, string]> => {
  try {
    const days = classesUtils.classDaysMapping[daysIndex]
    const response = await axiosClient.post<createCourseResponse>(
      `/api/${userId}/class`,
      { sectionId, courseName, startTime, endTime, days },
      { headers: { 
        'Content-Type': 'application/json' 
        },
        withCredentials: true 
      }
    )
    const newClass: any = response.data.newClass
    return [newClass, true, "Successfuly created new course"]
  } catch (error) {
    console.error(error)
    return [null, false, "Failed to create the course"]
  }
}

/**
 * This function takes in both the the user Id and the classId
 * in order to fetch all details necessary to render in the class
 * page.
 * 
 * @param userId - The id of the user.
 * @param classId - The class id of the class to fetch details.
 * @returns 
 */
const getClassDetails = async (
  userId: string,
  classId: string
): Promise<[any | null, boolean, string]> => {
  try {
    const response = await axiosClient.get<classDetailsResponse>(
      `/api/${userId}/class/${classId}`,
      { headers: { 
        'Content-Type': 'application/json' 
        },
        withCredentials: true 
      }
    )
    const classDetails: any = response.data.classDetails
    return [classDetails, true, "Successfully fetched course details"]
  } catch (error) {
    console.error(error)
    return [null, false, "Failed to fetch course details"]
  }
}

const classesApi = {
  fetchClasses,
  addStudentToCourse,
  createCourse,
  getClassDetails
}

export default classesApi