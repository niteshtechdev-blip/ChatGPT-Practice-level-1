import { Router } from "express";
import * as controllers from "../controllers/user.controller.js"
const router=Router()

router.route('/').get(controllers.home)
router.route('/register').post(controllers.register)
router.route('/login').post(controllers.login)

export default router