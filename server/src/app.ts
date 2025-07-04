import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './auth/auth.routes'
import classesRouter from './classes/classes.routes'
import fileSystemRouter from './filesystem/filesystem.routes'

const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api', classesRouter)
app.use('/api', fileSystemRouter)

export default app