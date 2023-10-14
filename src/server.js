require("express-async-errors");
require("dotenv/config")
const express = require("express");
const AppError = require("./utils/AppError");
const routes = require("./routes");
const migrateRun = require("./database/sqlite/migrations");


const cors = require("cors");
const uploadConfig = require("./config/upload");
const app = express();
app.use(express.json());
app.use(cors());
migrateRun();
app.use('/files', express.static(uploadConfig.upload))
app.use(routes);


app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.log(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT ||4000;
app.listen(PORT, () =>
  console.log(`Servidor Iniciado em http://localhost:${PORT}`)
);
