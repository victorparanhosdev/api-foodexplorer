const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class dishAvatarController {
  async update(request, response) {
    const {id} = request.params
    const user_id = request.user.id
    const dish = await knex("dish").where({id, user_id})
    
    

    return response.json();
  }
}

module.exports = dishAvatarController