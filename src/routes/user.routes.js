const {Router} = require("express")
const UserController = require("../controllers/userController")
const ensureAuthentication = require("../middleware/ensureAuthentication")
const userRoutes = Router()
const userController = new UserController()


userRoutes.post("/", userController.create)
userRoutes.put("/", ensureAuthentication, userController.update)


module.exports = userRoutes