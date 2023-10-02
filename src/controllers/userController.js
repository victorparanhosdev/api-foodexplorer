const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { hash, compare } = require("bcrypt");

class userController {
  async create(request, response) {
    const { name, email, password, isAdmin = false } = request.body;

   
    

    if (!name) {
      throw new AppError("Por favor Preencha o campo Nome.");
    }
    
    const emailLowerCase = email.toLowerCase();
    // Verificar se o email é válido usando uma expressão regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailLowerCase.match(emailRegex)) {
      throw new AppError("Por favor, insira um endereço de e-mail válido.");
    }

    if (password.length < 6) {
      throw new AppError("A senha deve ter no mínimo 6 caracteres.");
    }


    const database = await sqliteConnection();

    const checkEmail = await database.get(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (checkEmail) {
      throw new AppError("E-mail ja esta em uso");
    }

    const passwordHashed = await hash(password, 8);

    await database.run(
      `INSERT INTO users (name, email, password, isAdmin, created_date) VALUES (?, ?, ?, ?, strftime('%d-%m-%Y %H:%M:%S', 'now'))`,
      [name.trim(), email.toLowerCase().trim(), passwordHashed, isAdmin]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const database = await sqliteConnection();

    const user_id = request.user.id;
    const { name, email, password, old_password, isAdmin } = request.body;

    const user = await database.get(`SELECT * FROM users WHERE id = ?`, [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usúario Não Existe");
    }

    const checkEmailExists = await database.get(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (checkEmailExists && checkEmailExists.id !== user.id) {
      throw new AppError("E-mail já esta em uso");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar os dois campos para alterar a senha"
      );
    }

    if (password && old_password) {
      const comparePassword = await compare(old_password, user.password);

      if (!comparePassword) {
        throw new AppError("Senha não confere", 401);
      }

      user.password = await hash(password, 8);
    }


    user.isAdmin = isAdmin ?? user.isAdmin



    await database.run(
      `UPDATE users SET name = ?, email = ?, password = ?, isAdmin = ?, updated_date = strftime('%d-%m-%Y %H:%M:%S', 'now') WHERE id = ?`,
      [user.name, user.email, user.password, user.isAdmin, user_id]
    );

    return response.json();
  }
}

module.exports = userController;
