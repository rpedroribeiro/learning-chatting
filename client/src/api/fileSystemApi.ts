import axiosClient from "./client"
import { FileType } from "../utils/FileType"

type uploadFileSytemItemResponse = {
  fileItem: Object;
}

type allItemChildrenResponse = {
  allChildren: object
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
const uploadFileSystemItem = async (
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

/**
 * This function takes in the id of the current directory and sends
 * a GET request to collect all children. The children are either a
 * folder or a file, with the path to the file from the GCP bucket.
 * 
 * @param userId - The id of the user.
 * @param classId - The id of the current class.
 * @param parentId - The id of the item to fetch the children from.
 * @returns - All current children from the parent.
 */
const getAllChidrenFromItemId = async (
  userId: string,
  classId: string,
  parentId: string
): Promise<[any | null, boolean, string]> => {
  try {
    const response = await axiosClient.get<allItemChildrenResponse>(
      `/api/${userId}/class/${classId}/filesystem/${parentId}`,
      { headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
      }
    )
    const allChildren: any = response.data.allChildren
    return [allChildren, true, "Successfulyy fetched all children"]
  } catch (error) {
    console.error(error)
    return [null, false, "Failed to fetch all children"]
  }
}

const fileSystemApi = {
  uploadFileSystemItem,
  getAllChidrenFromItemId
}

export default fileSystemApi