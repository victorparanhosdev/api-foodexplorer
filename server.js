require("express-async-errors");
const express = require("express");
const AppError = require("./src/utils/AppError");
const routes = require("./src/routes");
const migrateRun = require("./src/database/sqlite/migrations");


const cors = require("cors");
const uploadConfig = require("./src/config/upload");
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

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Servidor Iniciado em http://localhost:${PORT}`)
);
