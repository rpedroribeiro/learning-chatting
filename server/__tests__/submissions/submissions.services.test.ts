import { createMockContext, MockContext } from "../../src/context/mockContext"
import submissionServices from "../../src/submissions/submission.services"
import mockData from "../mockData"


let mockCtx: MockContext

beforeEach(() => {
  mockCtx = createMockContext()
})

test("createSubmissionForAssignment creates a submission", async () => {
  mockCtx.prisma.submission.create.mockResolvedValue(mockData.completeMockSubmission)

  const result = await submissionServices.createSubmissionForAssignment(
    mockData.completeMockSubmission.assignmentId,
    mockData.completeMockSubmission.studentId,
    mockCtx,
  )

  expect(mockCtx.prisma.submission.create).toHaveBeenCalledWith({
    data: {
      assignmentId: mockData.completeMockSubmission.assignmentId,
      studentId: mockData.completeMockSubmission.studentId,
      submitted: mockData.completeMockSubmission.submitted,
    },
  })
  expect(result).toEqual(mockData.completeMockSubmission)
})

test("findSubmissionWithUserIdAndAssignmentId finds the correct submission", async () => {
  mockCtx.prisma.submission.findUnique.mockResolvedValue(mockData.completeMockSubmission)

  const result = await submissionServices.findSubmissionWithUserIdAndAssignmentId(
    mockData.completeMockSubmission.assignmentId,
    mockData.completeMockSubmission.studentId,
    mockCtx,
  )

  expect(mockCtx.prisma.submission.findUnique).toHaveBeenCalledWith({
    where: {
      assignmentId_studentId: {
        assignmentId: mockData.completeMockSubmission.assignmentId,
        studentId: mockData.completeMockSubmission.studentId,
      }
    },
  })
  expect(result).toEqual(mockData.completeMockSubmission)
})

test("uploadSubmissionFile uploads a file successfully", async () => {
  mockCtx.prisma.submission.update.mockResolvedValue(mockData.completeMockSubmission)

  const result = await submissionServices.uploadSubmissionFile(
    mockData.completeMockSubmission.studentId,
    mockData.completeMockSubmission.assignmentId,
    "file",
    mockCtx,
  )

  expect(mockCtx.prisma.submission.update).toHaveBeenCalledWith({
    where: {
      assignmentId_studentId: {
        assignmentId: mockData.completeMockSubmission.assignmentId,
        studentId: mockData.completeMockSubmission.studentId,
      }
    },
    data: { uploadedFiles: { push: 'file' } }
  })
  expect(result).toEqual(mockData.completeMockSubmission)
})

test("updateSubmissionStatus updates status successfully", async () => {
  mockCtx.prisma.submission.update.mockResolvedValue(mockData.completeMockSubmission)

  const result = await submissionServices.updateSubmissionStatus(
    mockData.completeMockSubmission.studentId,
    mockData.completeMockSubmission.assignmentId,
    mockCtx,
  )

  expect(mockCtx.prisma.submission.update).toHaveBeenCalledWith({
    where: {
      assignmentId_studentId: {
        assignmentId: mockData.completeMockSubmission.assignmentId,
        studentId: mockData.completeMockSubmission.studentId,
      }
    },
    data: {
      submitted: true,
      submissionTime: new Date()
    },
    include: {
      student: { 
        select: {
          firstName: true,
          lastName: true
        } 
      },
      assignment: {
        select: {
          name: true
        }
      }
    }
  })
  expect(result).toEqual(mockData.completeMockSubmission)
})