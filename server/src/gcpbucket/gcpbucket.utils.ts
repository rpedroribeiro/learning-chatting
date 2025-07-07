import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'

dotenv.config()
const storage = new Storage()
const bucketName: string = process.env.GOOGLE_BUCKET_NAME!


/**
 * This function takes in the desired path in the bucket and the path
 * to the local file and stores the file in the bucket.
 * 
 * @param destinationPath - The path that will be put in the bucket.
 * @param localFilePath - The local file used to access the file.
 */
const uploadFileToFileSystem = async (destinationPath: string, localFilePath: string) => {
  const options = {
    destination: destinationPath,
  }
  await storage.bucket(bucketName).upload(localFilePath, options)
}

/**
 * This function takes the desired folder path for the bucket and
 * places it in the bucket. 
 * 
 * @param folderName - The desired path for the folder in the bucket.
 */
const addFolderToFileSystem = async (folderPath: string) => {
  const bucket = storage.bucket(bucketName)
  const folder = bucket.file(`${folderPath}`)
  await folder.save('')
}

/**
 * This generates a url that allows the server to access the private
 * GCB for the next hour.
 * 
 * @param filePath - The path of the desired file in the bucekt..
 */
const generateV4ReadSignedUrl = async (fileName: string) => {
  const options = {
    version: 'v4' as const,
    action: 'read' as const,
    expires: new Date(Date.now() + 15 * 60 * 1000),
  }

  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options)

  return url
}

const gcpBucketUtils = {
  uploadFileToFileSystem,
  addFolderToFileSystem,
  generateV4ReadSignedUrl
}

export default gcpBucketUtils