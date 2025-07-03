import express from 'express'
import { prisma } from '../context/context'
import { authenticateToken } from '../auth/auth.jwt'
import authServices from '../auth/auth.services'
import { UserRole, FileType } from '@prisma/client'
import fileSystemServices from './filesystem.services'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import fileSystemUtil from './filesystem.utils'

const router = express.Router()
const ctx = { prisma }
const upload = multer({ dest: 'uploads/file-system'})
const bucketName: string = process.env.GOOGLE_BUCKET_NAME!

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

    const dbUrl = await fileSystemUtil.createNewFileSystemItem(
      req.file,
      fileName,
      validParent.fileURL
    )

    const newFileSystemItem = await fileSystemServices.createFileSystemItem(
      fileName,
      dbUrl,
      fileType,
      parentId,
      null,
      ctx
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
 * 
 */
router.get('/:userId/class/:classId/filesystem/:itemId', authenticateToken, async (req, res, next) => {
  try {
    const classId = req.params.classId
    const itemId = req.params.itemId

    const rootFileSystemItem = await fileSystemServices.findRootFileSystemItem(itemId, ctx)
    if (rootFileSystemItem?.classId !== classId) {
      res.status(400).json({message: "Root directory is not connected to the same class or any class"})
      throw new Error('Root directory is not connected to the same class or any class')
    }

    const currFileSystemItem = await fileSystemServices.findFileSystemItemById(itemId, ctx)
    res.status(200).json({fileSystemItem: currFileSystemItem})
  } catch (error) {
    console.error(error)
  }
})

export default router