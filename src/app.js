import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(cookieParser())
app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({ extended: true, limit: '20kb' }))
app.use(express.static('public'))
app.use(
    cors({
        credentials: true,
        origin: process.env.CORS_ORIGIN,
    })
)

export default app
