import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(
            `${process.env.MONGO_URL}/${DB_NAME}`
        )
        console.log(`Database Connection Done ${connect.connection.host}`)
    } catch (error) {
        console.log(`MongoDB Connection Error ${error}`)
        process.exit(1)
    }
}
export default connectDB
