import { Router } from "express";
import * as userController from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
const router=Router()

router.route('/').get(userController.home)
router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
router.route('/get-cookie').get(userController.accessCookie)
router.route('/read').get(userController.read)
router.route('/read/:id').post(userController.readById)
router.route('/update/:id').patch(userController.update)
router.route('/delete/:id').post(userController.deleteUser)
router.route('/search').post(userController.search)
router.route('/logout').post(verifyJWT,userController.logout)
router.route('/refresh-token').post(userController.refressAccessToken)

export default router