import { Router } from "express";
import * as controllers from "../controllers/user.controller.js"
const router=Router()

router.route('/').get(controllers.home)
router.route('/register').post(controllers.register)
router.route('/login').post(controllers.login)
router.route('/get-cookie').get(controllers.accessCookie)
router.route('/read').get(controllers.read)
router.route('/read/:id').post(controllers.readById)
router.route('/update/:id').patch(controllers.update)
router.route('/delete/:id').post(controllers.deleteUser)
router.route('/demo').post(controllers.demo)

// 

export default router