let express=require('express')
const protectRoute = require('../middlewares/auth.middleware');
const { registerController, loginController, searchUsersController } = require('../controllers/auth.controller')
let router=express.Router()
router.post('/register',registerController)
router.post('/login',loginController)
router.get('/search', protectRoute, searchUsersController)
module.exports=router