import axiosClient from "./client"
import { FileType } from "../utils/FileType"

type uploadFileSytemItemResponse = {
  fileItem: Object;
}

/**
 * This function takes in all the necessary parameters and sends a
 * POST request to create a new FileSystemItem and saved the image
 * in the GCP bucket.
 * 
 * @param userId - The id of the professor making this request.
 * @param classId - The id of the class adding the file item into.
 * @param file - The file object from the input tag.
 * @param fileName - The desired file name in the db and the bucket.
 * @param fileType - Folder or File.
 * @param parentId - THe id of the parent FileSystemItem.
 * @returns 
 */
const uploadFileSystemItel = async (
  userId: string,
  classId: string,
  file: File | null,
  fileName: string,
  fileType: FileType,
  parentId: string
) => {
  try {
    const formData  = new FormData()
    if (file) { formData.append('file', file) }
    const jsonBody = JSON.stringify({ fileName, fileType, parentId})
    formData.append('data', jsonBody)
    const response = await axiosClient.post<uploadFileSytemItemResponse>(
      `/api/${userId}/class/${classId}/filesystem`,
      formData,
      { withCredentials: true }
    )
    return response
  } catch (error) {
    console.error(error)
  }
}

const fileSystemApi = {
  uploadFileSystemItel
}

export default fileSystemApi