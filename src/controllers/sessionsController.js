const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { compare } = require("bcrypt");
const {sign} = require("jsonwebtoken")
const authConfig = require("../config/auth")

class sessionsController {
  async create(request, response) {
      const { email, password } = request.body;
      const database = await sqliteConnection();

    const user = await database.get(`SELECT * FROM users WHERE email = ?`, [email]);

    if(!user){
        throw new AppError("E-mail e/ou senha incorreta")
    }

    const verifyPassword = await compare(password, user.password)

    if(!verifyPassword){
        throw new AppError("E-mail e/ou senha incorreta")
    }

    const {expiresIn, secret} = authConfig.jwt

    const token = sign({}, secret, {
        subject: String(user.id),
        expiresIn
    })


    return response.json({user, token});
  }


}

module.exports = sessionsController;
