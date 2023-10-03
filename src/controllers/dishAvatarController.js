const AppError = require("../utils/AppError")
const diskStorage = require("../providers/DiskStorage")


class dishAvatarController {
    async update(request, response){

        const DiskStorage = new diskStorage()
        const user_id = request.user.id
        const filename = request.file

        return response.json(filename)

        
    }
}










module.exports = dishAvatarController