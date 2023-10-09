
const knex = require("../database/knex");
const diskStorage = require("../providers/DiskStorage")




class dishAvatarController {
    async update(request, response){
        const {id} = request.params
        const filename = request.file.filename
        const DiskStorage = new diskStorage()

        const dish = await knex("newdish").where({id}).first();
    
        if(dish.imgurl){
            await DiskStorage.deleteFile(filename)
        }
        const imgurl = await DiskStorage.saveFile(filename)
        dish.imgurl = imgurl

        await knex("newdish").update(dish).where({id});

        return response.json()

    }
}


module.exports = dishAvatarController;