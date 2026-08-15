import express from 'express'
const app =express()
import dotenv from 'dotenv'
import { mongo } from 'mongoose'
import { connectDB } from './db/connect.db.js'
import userRoutes from './routes/user.routes.js'
import { UserModel } from './models/user.model.js'
//config
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// DataBase Connection

connectDB();

//routes
app.use('/api/users',userRoutes)

app.get('/',(req,res)=>{
    res.send("Welcome")
})
app.post('/check',async(req,res)=>{
    try {
        const {password,userId}=req.body
        const user=await UserModel.findById(userId)
        const resultOfIsPasswordCorrect=await user.isPasswordCorrect(password)
        res.send(resultOfIsPasswordCorrect)
        console.log(resultOfIsPasswordCorrect)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            success:false,
            message:"error in check api"
        })
    }
})




//server
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port ${process.env.PORT}`)
})
