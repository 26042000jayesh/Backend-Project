const express = require("express");
const router = express.Router();
const registerController = require("../controllers/auth/registerController")
const loginController = require("../controllers/auth/loginController")
const userController = require("../controllers/auth/userController")
const refreshController = require("../controllers/auth/refreshController")
const auth = require("../middlewares/auth")

//auth end points
//for new users only
router.post('/register', registerController.register);
//for exixting users only
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);
router.get('/refresh',refreshController.refresh);
router.post('/logout', loginController.logout);

module.exports = router;