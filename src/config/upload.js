const multer = require('multer')
const path = require("path")
const crypto = require("crypto")

const tmp = path.resolve(__dirname, "..", "..", "tmp")
const upload = path.resolve(tmp, "uploads")

const MULTER = {
    storage: multer.diskStorage({
        destination: tmp,
        filename(request, file, cb){
            const FileHash = crypto.randomBytes(5).toString("hex")
            const fileName = `${FileHash}-${file.originalname}`

            return cb(null, fileName)
        }
    })
}

module.exports = {
    tmp, upload, MULTER
}