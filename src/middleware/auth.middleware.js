import jwt from 'jsonwebtoken'
import { UserModel } from "../models/user.model.js";
import { ApiError } from '../utils/ApiError.js';
export const verifyJWT=async(req, res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(404,"You are not authorized to access this route, please login first")
        }
        const decodedToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken){
            console.log("Invaalid Token")
            return res.status(401).json({
                success:false,
                message:"Token is Invalid"
            })
        }
        const id=decodedToken?._id
        const user=await UserModel.findById(id)
        req.user=user
        next();
    } catch (error) {
        console.log(`Error in Auth middleware:${error}`)
        console.log(error.statusCode)
        res.status(error?.statusCode||404).json({
            error:true,
            success:false,
            message:`please refresh your access token.(Route=/refresh-token) ${error?.message}`
        })
    }
}