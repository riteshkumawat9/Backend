import asyncHandler from '../utils/asyncHandler.js'
import User from '../models/user.model.js'
import uploadFile from '../utils/cloudinary.js'
import bcrypt from 'bcryptjs'

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

        res.status(201).json({
            message: 'User was Created ',
            createdUser,
        })
    } catch (error) {
        throw new Error(`Error in Register Controller ${error}`)
    }
}
export default {
    registerUser,
}
