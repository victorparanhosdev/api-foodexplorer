const AppError = require("../utils/AppError")
const diskStorage = require("../providers/DiskStorage")
const knex = require("../database/knex")

class dishAvatarController {
    async update(request, response){
        const user_id = request.user.id
        const {id} = request.params
        const DiskStorage = new diskStorage()
     
        const {filename} = request.file

        const name = await DiskStorage.saveFile(filename);

        await knex("newdish").where({id}).update({ imgurl: name });

        return response.json()

        
    }
}










module.exports = dishAvatarController