const {Router} = require("express")
const SessionsController = require("../controllers/sessionsController")

const sessionsRoutes = Router()
const sessionsController = new SessionsController()


sessionsRoutes.post("/", sessionsController.create)


module.exports = sessionsRoutes