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

const submissionServices = {
  createSubmissionForAssignment
}

export default submissionServices