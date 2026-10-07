import express from 'express'
import userController from '../controllers/user.controller.js'
import upload from '../middlewares/multer.middlewares.js'
import verifyJWT from '../middlewares/auth.middlewares.js'

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

userRouter.post('/login', userController.loginUser)

// secure route
userRouter.get('/logout', verifyJWT, userController.logoutUser)

export default userRouter
