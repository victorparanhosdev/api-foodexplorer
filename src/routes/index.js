const {Router} = require("express")
const userRoutes = require("./user.routes")
const sessionsRoutes = require("./sessions.routes")
const dishRoutes = require("./dish.routes")
const routes = Router()

routes.use("/users", userRoutes)
routes.use("/dish", dishRoutes)
routes.use("/sessions", sessionsRoutes)

module.exports = routes