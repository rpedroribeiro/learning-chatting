import axiosClient from "./client"

type uploadFileSubmissionResposne = {
  submission: any
}

/**
 * This funciton calls the POST request to upload the new submission file
 * to the database and to the GCP bucket. This function does not submit the
 * files, just uploads them to the backend.
 * 
 * @param userId - The id of the user making the request.
 * @param classId - The id of the class the assginment belongs to.
 * @param assignmentId - The id of the assignment uploading the file to.
 * @param file - The file to be uploaded.
 * @returns 
 */
const uploadSubmissionFile = async (
  userId: string,
  classId: string,
  assignmentId: string,
  file: File
) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axiosClient.post<uploadFileSubmissionResposne>(
      `api/${userId}/class/${classId}/assignment/${assignmentId}/uploadfiles`,
      formData,
      { withCredentials: true }
    )
    return response
  } catch (error) {
    console.error(error)
  }
}

const submissionApi = {
  uploadSubmissionFile
}

export default submissionApi