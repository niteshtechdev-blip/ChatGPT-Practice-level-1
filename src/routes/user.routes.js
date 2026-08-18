import { Router } from "express";
import * as userController from "../controllers/user.controller.js"
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

// 

export default router