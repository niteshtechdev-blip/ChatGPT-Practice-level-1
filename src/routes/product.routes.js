import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router=Router()

router.route('/').get(productController.home)
router.route('/add').post(productController.productAdd)
router.route('/read').get(productController.productReadAll)
router.route('/read/:id').post(productController.productReadOne)
router.route('/update/:id').patch(productController.productUpdate)
router.route('/delete/:id').delete(productController.productDelete)

//-------------product image -------------

router.route('/product-image').post(upload.fields([{name:'productImage',maxCount:1}]),productController.productImage)


export default router