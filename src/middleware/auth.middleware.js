import jwt from 'jsonwebtoken'
import { UserModel } from "../models/user.model.js";
export const verifyJWT=async(req, res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            console.log("Token is not in cookies")
            return res.status(404).json({
                success:false,
                message:"Unauthorized Request"
            })
        }
        const decodedToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken){
            console.log("Invaalid Token")
            return res.status(401).json({
                success:false,
                message:"Token is not Invalid"
            })
        }
        const id=decodedToken?._id
        const user=await UserModel.findById(id)
        req.user=user
        next();
    } catch (error) {
        console.log(`Error in Auth middleware:${error}`)
        res.status(404).json({
            success:false,
            message:`authentication issue`
        })
    }
}