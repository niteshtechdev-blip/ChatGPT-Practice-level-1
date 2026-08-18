import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
const router=Router()

router.route('/').get(productController.home)
router.route('/add').post(productController.productAdd)
router.route('/read').get(productController.productReadAll)
router.route('/read/:id').post(productController.productReadOne)

export default router