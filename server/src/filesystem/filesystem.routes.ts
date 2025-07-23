import express from 'express'
import { prisma } from '../context/context'
import { authenticateToken } from '../auth/auth.jwt'
import authServices from '../auth/auth.services'
import { UserRole, FileType, NotificationType, CommandCategory } from '@prisma/client'
import fileSystemServices from './filesystem.services'
import multer from 'multer'
import fileSystemUtil from './filesystem.utils'
import gcpBucketUtils from '../gcpbucket/gcpbucket.utils'
import notificationsUtils from '../notifications/notifications.utils'

const router = express.Router()
const ctx = { prisma }
const upload = multer({ dest: 'uploads/file-system'})
const bucketName: string = process.env.GOOGLE_BUCKET_NAME!
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * This route uploads will create a new FileSystem item in the database
 * using the params passed in and will also store the file sent to the 
 * bucket provided by Google Cloud Provider. The saved url will allow 
 * for easy access from the file in the bucket.
 */
router.post('/:userId/class/:classId/filesystem', upload.single('file'), authenticateToken, async (req, res, next) => {
  try {
    const { fileName, fileType, parentId } = JSON.parse(req.body.data)
    const userId = req.params.userId
    const classId = req.params.classId

    const validUser = await authServices.findUserById(userId, ctx)
    if (validUser?.accountType === UserRole.Student) {
      res.status(400).json({message: "Students cannot create items in the file system"})
      throw new Error('Students cannot create items in the file system')
    }

    const validParent = await fileSystemServices.findFileSystemItemById(parentId, ctx)
    if (validParent?.type === FileType.File) {
      res.status(400).json({message: "Cannot create new item under a file, must be under a folder"})
      throw new Error('Cannot create new item under a file, must be under a folder')
    }

    if (!validParent?.fileURL) {
      res.status(400).json({message: "Cannot create new item under a file, must be under a folder"})
      throw new Error('Cannot create new item under a file, must be under a folder')
    }
    
    const allParentChildren: any = await fileSystemServices.findAllChidrenForFileSystemItem(parentId, ctx)
    for (const key in allParentChildren) {
      const child = allParentChildren[key]
      if (child.name === "fileName") {
        res.status(400).json({message: "FIle/Folder with this name already exists in directory"})
        throw new Error('FIle/Folder with this name already exists in directory')
      }
    }

    const [dbUrl, dbFileName] = await fileSystemUtil.createNewFileSystemItem(
      req.file,
      fileName,
      validParent.fileURL
    )

    const newFileSystemItem = await fileSystemServices.createFileSystemItem(
      dbFileName,
      dbUrl,
      fileType,
      parentId,
      null,
      ctx
    )

    await notificationsUtils.createNotificationAsProfessor(
      userId,
      classId,
      NotificationType.FileSystemItemCreated,
      newFileSystemItem,
      res
    )

    res.status(200).json({fileSystemItem: newFileSystemItem})
  } catch (error) {
    console.error(error)
  }
})

/**
 * This route is a GET request that uses the id of the current FileSystemItem
 * to get all of its children. It also checks if the root of the item id is
 * in the same classs as the one in the route.
 */
router.get('/:userId/class/:classId/filesystem/:parentId/children', authenticateToken, async (req, res, next) => {
  try {
    const classId = req.params.classId
    const parentId = req.params.parentId

    const rootFileSystemItem = await fileSystemServices.findRootFileSystemItem(parentId, ctx)
    if (rootFileSystemItem?.classId !== classId) {
      res.status(400).json({message: "Root directory is not connected to the same class or any class"})
      throw new Error('Root directory is not connected to the same class or any class')
    }

    const allFileSystemItemChildren = await fileSystemServices.findAllChidrenForFileSystemItem(parentId, ctx)
    res.status(200).json({allChildren: allFileSystemItemChildren})
  } catch (error) {
    console.error(error)
  }
})

/**
 * This route takes the id or name of the desired FileSytemItem and returns all the 
 * attributes for it.
 */
router.get('/:userId/class/:classId/filesystem/:itemId', authenticateToken, async (req, res, next) => {
  try {
    const classId = req.params.classId
    const itemId = req.params.itemId

    if (uuidRegex.test(itemId)) {
      const rootFileSystemItem = await fileSystemServices.findRootFileSystemItem(itemId, ctx)
      if (rootFileSystemItem?.classId !== classId) {
        res.status(400).json({message: "Root directory is not connected to the same class or any class"})
        throw new Error('Root directory is not connected to the same class or any class')
      }
      const currFileSystemItem = await fileSystemServices.findFileSystemItemById(itemId, ctx)
      res.status(200).json({fileSystemItem: currFileSystemItem})
    } else {
      const itemName = itemId
      const itemFound = await fileSystemServices.findFileSystemItemByName(
        itemName,
        ctx
      )
      if (itemFound !== null) { res.status(200).json({commandBotData: itemFound, commandCategory: CommandCategory.ViewFileSystemItem}) }
      else { res.status(200).json({errorMessage: "Could not find filesystem item provided"}) }
    }
  } catch (error) {
    console.error(error)
  }
})

router.get('/:userId/class/:classId/filesystem/:itemId/url', authenticateToken, async (req, res, next) => {
  try {
    const itemId = req.params.itemId

    const validItem = await fileSystemServices.findFileSystemItemById(itemId, ctx)
    if (validItem?.type === FileType.Folder) {
      res.status(400).json({message: "Cannot get signed url for a folder"})
      throw new Error('Cannot get signed url for a folder')
    }

    if (!validItem?.fileURL) {
      res.status(400).json({message: "Cannot get signed url for a folder"})
      throw new Error('Cannot get signed url for a folder')
    }

    const signedUrl = await gcpBucketUtils.generateV4ReadSignedUrl(validItem?.fileURL)
    res.status(200).json({signedUrl: signedUrl})
  } catch (error) {
    console.error(error)
  }
})

export default router