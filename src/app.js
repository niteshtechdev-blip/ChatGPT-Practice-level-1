import express from 'express'
const app =express()
import dotenv from 'dotenv'
import { mongo } from 'mongoose'
import { connectDB } from './db/connect.db.js'
import userRoutes from './routes/user.routes.js'
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




//server
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port ${process.env.PORT}`)
})
