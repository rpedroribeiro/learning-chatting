import gcpBucketUtils from '../gcpbucket/gcpbucket.utils'
import fs from 'fs'

/**
 * This function takes in all the necessary information to create a new
 * path to an uploaded file in the submissions section of the CGP bucket.
 * 
 * @param file - The file we will be taking th elocal path of to upload.
 * @param assignmentName - The name of the assignment to find the dir.
 * @param studentFirstName - The studen'ts first name to create their dir.
 * @param studentLastName -The studen'ts last name to create their dir.
 * @returns - The path to access the uploaded file.
 */
const uploadSubmissionFiles = async (
  file: Express.Multer.File,
  assignmentName: string,
  studentFirstName: string,
  studentLastName: string
) => {
  const localFilePath = file.path
  const fileName = file.originalname
  const finalDestination = `assignments/${assignmentName}/submissions/${studentFirstName}_${studentLastName}/${fileName}`
  await gcpBucketUtils.uploadFileToFileSystem(finalDestination, localFilePath)
  fs.unlink(localFilePath, (err) => { if (err) { console.error('Failed to delete file', err) } })
  return finalDestination
}

const submissionUtils = {
  uploadSubmissionFiles
}

export default submissionUtils