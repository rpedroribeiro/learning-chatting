import express from 'express'
import { prisma } from '../context/context'
import { authenticateToken } from '../auth/auth.jwt'
import authServices from '../auth/auth.services'
import { UserRole, FileType } from '@prisma/client'
import fileSystemServices from './filesystem.services'
import classService from '../classes/classes.services'

const router = express.Router()
const ctx = { prisma }

/**
 * 
 */
router.post('/:userId/class/:classId/filesystem', authenticateToken, async (req, res, next) => {
  try {
    const { fileUrl, fileName, fileType, parentId } = req.body
    const userId = req.params.userId

    const validUser = await authServices.findUserById(userId, ctx)
    if (validUser?.accountType === UserRole.Student) {
      res.status(400).json({message: "Students cannot create items in the file system}"})
    }

    const validParent = await fileSystemServices.findFileSystemItemById(parentId, ctx)
    if (validParent?.type === FileType.File) {
      res.status(400).json({message: "Cannot create new item under a file, must be under a folder"})
    }

    const newFileSystemItem = await fileSystemServices.createFileSystemItem(
      fileName,
      fileUrl,
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