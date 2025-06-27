import axiosClient from "./client"

type fetchClassesResponse = {
  classList: Object;
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

const classesApi = {
  fetchClasses
}

export default classesApi