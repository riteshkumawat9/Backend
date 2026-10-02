import asyncHandler from '../utils/asyncHandler.js'

const registerUser = (req, res) => {
    res.status(200).json({
        message: 'ok',
    })
}

export default {
    registerUser,
}
