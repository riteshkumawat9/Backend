import asyncHandler from '../utils/asyncHandler.js'
import User from '../models/user.model.js'
import uploadFile from '../utils/cloudinary.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const registerUser = async (req, res) => {
    try {
        const { username, email, fullName, avatar, password, coverImage } =
            req.body

        if ([username, email, fullName, password].some((f) => !f?.trim())) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // Check user Exist or Not
        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        })
        if (existedUser)
            return res.status(409).json({
                message: 'User Is Already exist ',
            })

        // find URL
        const avatarLocalPath = req.files?.avatar[0]?.path
        const coverImageLocalPath = req.files?.coverImage[0]?.path

        if (!avatarLocalPath)
            return res.status(500).json({
                message: 'Avatar upload failed',
            })

        // Uplode on Cloudinary
        const cloudinaryAvatar = await uploadFile(avatarLocalPath)
        const cloudinaryCoverImage = await uploadFile(coverImageLocalPath)

        if (!cloudinaryAvatar) return res.send('Avatar Image is Required')

        // Create User and Password Encoded
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const createdUser = await User.create({
            username,
            email,
            fullName,
            password: hash,
            avatar: cloudinaryAvatar.url,
            coverImage: cloudinaryCoverImage?.url || '',
        })

        // tokens
        const refreshToken = jwt.sign(
            {
                _id: createdUser._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        )

        const accessToken = jwt.sign(
            {
                email: createdUser.email,
                username: createdUser.username,
                password: createdUser.password,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        )

        // set token
        res.cookie('accessToken', accessToken)
        res.cookie('refreshToken', refreshToken)

        res.status(201).json({
            message: 'User was Created ',
            createdUser,
        })
    } catch (error) {
        throw new Error(`Error in Register Controller ${error}`)
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body ?? {}

        if (!email && !username) {
            return res.status(400).json({
                message: 'Email or username and password are required',
            })
        }

        const user = await User.findOne({
            $or: [{ username }, { email }],
        })
        if (!user) return res.status(404).json({ message: 'User not found' })

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch)
            return res.status(401).json({ message: 'Invalid password' })

        const refreshToken = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        )

        const accessToken = jwt.sign(
            { _id: user._id, email: user.email, username: user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        )

        const options = { httpOnly: true, secure: true }

        const safeUser = user.toObject()
        delete safeUser.password

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({ message: 'User logged in successfully', user: safeUser })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `Error in login controller: ${error.message}` })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        return res.status(200).json({ message: 'User logged out successfully' })
    } catch (error) {
        return res
            .status(500)
            .json({ message: `Error in logout controller: ${error.message}` })
    }
}

export default {
    registerUser,
    loginUser,
    logoutUser,
}
