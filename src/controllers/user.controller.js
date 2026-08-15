import { UserModel } from "../models/user.model.js";

export const register=async(req,res)=>{
    try {
        const{name,email,age,password,role}=req.body;
        const user=UserModel({
            name,
            email,
            age,
            password
        })
        await user.save()
        const userResponse=user.toObject();
        delete userResponse.password;
        res.status(200).json({
            success:true,
            user:userResponse
        })
    } catch (error) {
        console.log(`Register Error ${error.message}`)
        res.status(500).json({
            success:false,
            message:"Registration Failed"
        })
    }
}