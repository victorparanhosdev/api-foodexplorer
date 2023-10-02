const fs = require("fs")
const path = require("path")

const upload = require("../config/upload")

class DiskStorage {
    async saveFile(file){
        await fs.promises.rename(
            path.resolve(upload.tmp, file),
            path.resolve(upload.upload, file)
        )
        return file
    }

    async deleteFile(file){
        const filePath = path.resolve(upload.upload, file)

        try{
            await fs.promises.stat(filePath)


        }catch{
            return
        }

        await fs.promises.unlink(filePath)
       
    }
}

module.exports = DiskStorage