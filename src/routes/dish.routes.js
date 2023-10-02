const {Router} = require("express")
const DishController = require("../controllers/dishController")
const ensureAuthentication = require("../middleware/ensureAuthentication")
const adminAuthentication = require("../middleware/adminAuthentication")

const dishRoutes = Router()
const dishController = new DishController()



dishRoutes.post("/", ensureAuthentication, adminAuthentication, dishController.create)
dishRoutes.put("/:id", ensureAuthentication, adminAuthentication, dishController.update)
dishRoutes.delete("/:id", ensureAuthentication, adminAuthentication, dishController.delete)
dishRoutes.get("/:id", ensureAuthentication, dishController.show)
dishRoutes.get("/", ensureAuthentication, dishController.index)

module.exports = dishRoutes