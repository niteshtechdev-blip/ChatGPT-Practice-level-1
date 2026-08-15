import { Router } from "express";
import * as controllers from "../controllers/user.controller.js"
const router=Router()

router.route('/register').post(controllers.register)
export default router