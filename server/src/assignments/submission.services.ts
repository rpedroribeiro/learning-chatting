import { Context } from "../context/context"

/**
 * This function takes in the assignmentId and the studentId from the
 * createNewAssignment function and makes a new submission instance for
 * that specific student.
 * 
 * @param assignmentId - The assignment the submission is related to.
 * @param studentId - The student the submission belongs to.
 * @param ctx - The prisma context that this function is being used in.
 */
const createSubmissionForAssignment = async (
  assignmentId: string,
  studentId: string,
  ctx: Context
) => {
  await ctx.prisma.submission.create({
    data: {
      assignmentId: assignmentId,
      studentId: studentId,
      submitted: false
    }
  })
}

/**
 * This function returns the submission object using both the assignmentId
 * and the userId to query the object.
 * 
 * @param assignmentId - The assignmentId of the submission instance.
 * @param studentId - The id of the student of the submission instance
 * @param ctx - The prisma context that this function is being used in.
 * @returns - The desired submission object.
 */
const findSubmissionWithUserIdAndAssignmentId = async (
  assignmentId: string,
  studentId: string,
  ctx: Context
) => {
  return await ctx.prisma.submission.findUnique({
    where: {
      assignmentId_studentId: {
        assignmentId: assignmentId,
        studentId: studentId
      }
    }
  })
}

/**
 * This function uses both the studentId and the assignment to first query
 * the submission instance and then pushes the new filePath to the list of 
 * the uploaded file's strings. It then returns the new updated submission
 * instance.
 * 
 * @param assignmentId - The assignmentId of the submission instance.
 * @param studentId - The id of the student of the submission instance
 * @param filePath - The filepath of the new file to be uploaded.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - The new updated submission object.
 */
const uploadSubmissionFile = async (
  studentId: string,
  assignmentId: string,
  filePath: string,
  ctx: Context
) => {
  return await ctx.prisma.submission.update({
    where: {
      assignmentId_studentId: {
        assignmentId: assignmentId,
        studentId: studentId
      }
    },
    data: {
      uploadedFiles: {
        push: filePath
      }
    }
  })
}

/**
 * This function updates the uploadedFiles list from the desired submission
 * instance by deleting the desired filePath from the list, and returning the
 * new updated submission object.
 * 
 * @param assignmentId - The assignmentId of the submission instance.
 * @param studentId - The id of the student of the submission instance
 * @param filePath - The filepath of the to be deleted file.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - The new updated submission object.
 */
const deleteSubmissionFile = async (
  studentId: string,
  assignmentId: string,
  filePath: string,
  ctx: Context
): Promise<any> => {
  const submission = await ctx.prisma.submission.findUnique({
    where: {
      assignmentId_studentId: {
        assignmentId: assignmentId,
        studentId: studentId
      }
    },
    select: {
      uploadedFiles: true
    }
  })
  if (submission) {
    const updatedFiles = submission.uploadedFiles.filter(path => path !== filePath)
    return await ctx.prisma.submission.update({
      where: {
        assignmentId_studentId: {
          assignmentId: assignmentId,
          studentId: studentId
        }
      },
      data: {
        uploadedFiles: updatedFiles
      }
    })
  }
  return null
}

const submissionServices = {
  createSubmissionForAssignment,
  uploadSubmissionFile,
  deleteSubmissionFile,
  findSubmissionWithUserIdAndAssignmentId
}

export default submissionServices