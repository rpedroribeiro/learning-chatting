import { UserRole } from "@prisma/client"
import * as bcrypt from 'bcrypt'
import { createMockContext, MockContext } from "../../src/context/mockContext"
import authServices from '../../src/auth/auth.services'
import authJwt from "../../src/auth/auth.jwt"

let mockCtx: MockContext

beforeEach(() => {
  mockCtx = createMockContext()
})

// Mock Data
const currentDate = new Date()
const refreshToken = 'refresh-token'
const hashedToken = 'hashed-refresh-token'

const mockRefreshToken = {
  id: '1',
  createdAt: currentDate,
  updatedAt: currentDate,
  hashedToken,
  userId: '1',
  revoked: false,
  expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
}

const mockUser = {
  id: "1",
  email: 'test@gmail.com',
  password: '12345678',
  firstName: 'test',
  lastName: 'user',
  accountType: UserRole.Professor,
  createdAt: currentDate,
  updatedAt: currentDate
}

// Tests
test('createUserByEmailAndPassword creates a new user with hashed password', async () => {
  const hashedPassword = await bcrypt.hash(mockUser.password, 12)
  mockCtx.prisma.user.create.mockResolvedValue({
    ...mockUser,
    password: hashedPassword,
  })
  const result = await authServices.createUserByEmailAndPassword(mockUser, mockCtx)
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

test('findUserById returns the user object with the matching Id', async () => {
  mockCtx.prisma.user.findUnique.mockResolvedValue(mockUser)
  const result = await authServices.findUserById("1", mockCtx)
  expect(result).toMatchObject(mockUser)
})

test('findUserByEmail returns the user object with the matching email', async () => {
  mockCtx.prisma.user.findUnique.mockResolvedValue(mockUser)
  const result = await authServices.findUserById("test@gmail.com", mockCtx)
  expect(result).toMatchObject(mockUser)
})

test('addRefreshTokenToWhiteList adds a new refresh token to the whitelist', async () => {
  mockCtx.prisma.refreshToken.create.mockResolvedValue(mockRefreshToken)
  jest.spyOn(authJwt, 'hashToken').mockReturnValue(hashedToken)
  const result = await authServices.addRefreshTokenToWhiteList(refreshToken, mockUser.id, mockCtx)
  expect(result).toMatchObject(mockRefreshToken)
})

test('findRefreshToken finds a refresh token by its token string', async () => {
  mockCtx.prisma.refreshToken.findUnique.mockResolvedValue(mockRefreshToken)
  jest.spyOn(authJwt, 'hashToken').mockReturnValue(hashedToken)
  const result = await authServices.findRefreshToken(refreshToken, mockCtx)
  expect(result).toMatchObject(mockRefreshToken)
})

test('deleteRefreshTokenById deletes a refresh token by its ID', async () => {
  const deletedToken = { ...mockRefreshToken, revoked: true }
  mockCtx.prisma.refreshToken.update.mockResolvedValue(deletedToken)
  const result = await authServices.deleteRefreshTokenById(mockRefreshToken.id, mockCtx)
  expect(result).toMatchObject(deletedToken)
})
test('revokeTokens revokes all refresh tokens for a user', async () => {
  mockCtx.prisma.refreshToken.updateMany.mockResolvedValue({ count: 2 })
  const result = await authServices.revokeTokens(mockUser.id, mockCtx)
  expect(result).toEqual({ count: 2 })
  expect(result.count).toBe(2)
})