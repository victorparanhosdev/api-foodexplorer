const AppError = require("../utils/AppError");

const { verify } = require("jsonwebtoken");
const authConfig = require("../config/auth");

function ensureAuthentication(request, response, next) {
  const auhtHeader = request.headers.authorization;

  if (!auhtHeader) {
    throw new AppError("Autenticação não fornecida", 401);
  }

  try {
    const [, token] = auhtHeader.split(" ");
    const { sub: user_id } = verify(token, authConfig.jwt.secret);
    
    request.user = {
      id: Number(user_id),
    };
  } catch (error) {
    throw new AppError("TOKEN INVALIDO", 401);
  }

  next();
}

module.exports = ensureAuthentication;
