import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
const uploadFile = async (localFilePath) => {
    try {
        const result = await cloudinary.uploader.upload(localFilePath, {
            public_id: 'quickstart-sample',
        })
        console.log(`Uploaded: ${result.public_id}`)
        return result
    } catch (error) {
        console.log(`Failed in Upload Check Method ${error}`)
    }
}

export default uploadFile
