import { Storage } from '@google-cloud/storage'
import path from 'path'
import dotenv from 'dotenv'
import fs from 'fs'
import gcpBucketUtils from '../gcpbucket/gcpbucket.utils'

dotenv.config()
const storage = new Storage()
const bucketName: string = process.env.GOOGLE_BUCKET_NAME!

/**
 * This function takes in the desired file and file name or just the
 * folder name along with the parent url to create the object in the
 * GCP bucket. It then returns a usable url to store in the database.
 * 
 * @param file - The multer file item.
 * @param fileSystemItemName - The new desired file/folder name.
 * @param parentUrl - The url of the parent of the file/folder.
 * @returns - The url to be used in the database.
 */
const createNewFileSystemItem = async (
  file: Express.Multer.File | undefined,
  fileSystemItemName: string,
  parentUrl: string | null
): Promise<[string, string]> => {
  let dbUrl
  let dbFileName
  if (!file) {
    const newFileName = fileSystemItemName + '/'
    const folderPath = `${parentUrl}${newFileName}`
    await gcpBucketUtils.addFolderToFileSystem(folderPath)
    dbFileName = fileSystemItemName
    dbUrl = folderPath
  } else {
    const originalExt = path.extname(file.originalname)
    const newFileName = fileSystemItemName + originalExt
    const localFilePath = file.path
    const destinationPath = `${parentUrl}${newFileName}`
    await gcpBucketUtils.uploadFileToFileSystem(destinationPath, localFilePath)
    fs.unlink(localFilePath, (err) => { if (err) { console.error('Failed to delete file', err) } })
    dbFileName = newFileName
    dbUrl = destinationPath
  }
  return [dbUrl, dbFileName]
}

const fileSystemUtil = {
  createNewFileSystemItem
}

export default fileSystemUtil