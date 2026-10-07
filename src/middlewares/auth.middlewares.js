import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const verifyJWT = async (req, res, next) => {
    try {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    await jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ message: 'Failed to authenticate token' })
        }
        req.user = decoded
        next()
    })

    await User.findById(req.user.id).then((user) => {
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
    })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export default verifyJWT
