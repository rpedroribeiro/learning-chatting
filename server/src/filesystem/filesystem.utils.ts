import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'

dotenv.config()
const storage = new Storage()
const bucketName: string = process.env.GOOGLE_BUCKET_NAME!

/**
 * This function takes the desired filepath and the filename of the
 * file we want to store in the GCB.
 * 
 * @param filePath - The new path of the file to be uploaded.
 * @param fileName - The desired file name for the bucket.
 */
const uploadFileToFileSystem = async (filePath: string, fileName: string) => {
  const destFileName = `file_system/${fileName}`
  const options = {
    destination: destFileName,
  }

  await storage.bucket(bucketName).upload(filePath, options)
}

/**
 * This generates a url that allows the server to access the private
 * GCB for the next hour.
 * 
 * @param fileName - The name of the file desired.
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