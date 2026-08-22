import { Router } from "express";
import * as userController from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
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
router.route('/change-details').post(verifyJWT, userController.changeUserDetails)


//Secured Routes (Mean if user logedin then these routes will work)
router.route('/logout').post(verifyJWT,userController.logout)
router.route('/refresh-token').post(userController.refreshAccessToken)
router.route('/current-user').get(verifyJWT,userController.currentUser)
router.route('/change-password').post(verifyJWT,userController.changePassword)

//File upload route
router.route('/upload-avatar').post(verifyJWT,upload.fields([{name:"avatar",maxCount:1}]),userController.uploadAvatar)
router.route('/upload-coverImage').post(verifyJWT,upload.fields([{name:"coverImage",maxCount:1}]),userController.uploadCoverImage)


//public assets route
router.route('/upload-assets').post(verifyJWT,upload.fields([{name:"assets",maxCount:5}]),userController.uploadAssets)



export default router