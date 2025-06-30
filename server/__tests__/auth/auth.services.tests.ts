import { UserRole } from "@prisma/client"
import * as bcrypt from 'bcrypt'
import { createMockContext, MockContext } from "../../src/context/mockContext"
import authServices from '../../src/auth/auth.services'

let mockCtx: MockContext

beforeEach(() => {
  mockCtx = createMockContext()
})

test('should create user by email and password', async () => {
  const currentDate = new Date()
  const user = {
    id: "1",
    email: 'test@gmail.com',
    password: '12345678',
    firstName: 'test',
    lastName: 'user',
    accountType: UserRole.Professor,
    createdAt: currentDate,
    updatedAt: currentDate
  }

  const hashedPassword = await bcrypt.hash(user.password, 12)
  mockCtx.prisma.user.create.mockResolvedValue({
    ...user,
    password: hashedPassword,
  })

  const result = await authServices.createUserByEmailAndPassword(user, mockCtx)

  expect(await bcrypt.compare('12345678', result.password)).toBe(true)
  expect(result).toMatchObject({
    id: "1",
    email: 'test@gmail.com',
    firstName: 'test',
    lastName: 'user',
    accountType: UserRole.Professor,
    createdAt: currentDate,
    updatedAt: currentDate
  })
})
