const {Router} = require("express")
const DishController = require("../controllers/dishController")
const ensureAuthentication = require("../middleware/ensureAuthentication")
const adminAuthentication = require("../middleware/adminAuthentication")
const DishAvatarController = require("../controllers/dishAvatarController")

const multer = require("multer")
const uploadConfig = require("../config/upload")
const upload = multer(uploadConfig.MULTER)

const dishRoutes = Router()
const dishController = new DishController()
const dishAvatarController = new DishAvatarController()



dishRoutes.post("/", ensureAuthentication, adminAuthentication,  upload.single("uploadImg"), dishController.create)
dishRoutes.put("/:id", ensureAuthentication, adminAuthentication, dishController.update)
dishRoutes.patch("/:id", ensureAuthentication, adminAuthentication, upload.single("patchImg"), dishAvatarController.update)
dishRoutes.delete("/:id", ensureAuthentication, adminAuthentication, dishController.delete)
dishRoutes.get("/:id", ensureAuthentication, dishController.show)
dishRoutes.get("/", ensureAuthentication, dishController.index)

module.exports = dishRoutes