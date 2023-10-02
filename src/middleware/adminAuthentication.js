const AppError = require("../utils/AppError");
const knex = require("../database/knex");

async function adminAuthentication(request, response, next) {
  const user_id = request.user.id;
  const isAdmin = await knex("users").where({ id: user_id, isAdmin: true }).first();

  if (!isAdmin) {
    throw new AppError("Usuário não autorizado", 401);
  }

  next();
}

module.exports = adminAuthentication;