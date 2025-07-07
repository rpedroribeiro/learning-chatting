import gcpBucketUtils from '../gcpbucket/gcpbucket.utils'
import fs from 'fs'

/**
 * This function takes in all the files needed to complete the assignment,
 * and stores them in the GCP bucket under a directory using the 
 * assignment name. Returns a list of all the paths of the uplaoded files. 
 * 
 * @param files - The files needed to complete the assignment.
 * @param assignmentName - The name of the assignment and also the dir name.
 * @returns - A list with all of the paths of the uploaded files.
 */
const uploadAssignmentFiles = async (
  files: Express.Multer.File[],
  assignmentName: string,
) => {
  let filesUrls = []
  const folderName = `assignments/${assignmentName}/assignmentFiles/`
  gcpBucketUtils.addFolderToFileSystem(folderName)
  for (const file of files) {
    const fileDestination = folderName + file.originalname
    const localFilePath = file.path
    gcpBucketUtils.uploadFileToFileSystem(fileDestination, localFilePath)
    fs.unlink(localFilePath, (err) => { if (err) { console.error('Failed to delete file', err) } })
    filesUrls.push(fileDestination)
  }
  return filesUrls
}

const assignmentUtils = {
  uploadAssignmentFiles
}

export default assignmentUtils