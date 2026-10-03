import express from 'express'
import userController from '../controllers/user.controller.js'
import upload from '../middlewares/multer.middlewares.js'

const userRouter = express.Router()

userRouter.post(
    '/register',
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1,
        },
        {
            name: 'coverImage',
            maxCount: 1,
        },
    ]),
    userController.registerUser
)

export default userRouter
