import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    },
})

console.log(`File Is Uplode in Public Folder ${storage}`)

const upload = multer({ storage })
export default upload
