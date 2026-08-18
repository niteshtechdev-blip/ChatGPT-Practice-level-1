import { ProductModal } from "../models/product.model.js"

export const home =async(req,res)=>{
    res.send("I am product home")
}


// -------ADD PRODUCT-----------

export const productAdd=async(req,res)=>{
    try {
        const{name,description,price,discount,category,brand,stock,rating,isAvailable}=req.body
        const data=await ProductModal.create({
            name,
            description,
            price,
            discount,
            category,
            brand,
            stock,
            rating,
            isAvailable
        })
        if(!data){
            return console.log("Error in product add")
        }
        res.status(200).json({
            success:true,
            message:"Product add success",
            Product:data
        })
    } catch (error) {
        console.log(`Error in product add ${error.message}`)
        res.status(400).json({
            success:false,
            message:"Product add Failed"
        })
    }
}


// ---------READ All PRODUCTS----------

export const productReadAll=async(req,res)=>{
    try {
        const data=await ProductModal.find().select("-createdAt -updatedAt -__v")
        if(!data){
            return res.status(404).json({
                success:false,
                message:"No data Found"
            })
        }
        console.log("All data retrived")
        res.status(200).json({
            success:true,
            message:"Data Retrive successfully",
            Data:data
        })
    } catch (error) {
        console.log(`Error in data retrive ${error.message}`)
        res.status(404).json({
            success:false,
            message:"Data Retrive Failed"
        })
    }

}

export const productReadOne=async (req,res)=>{
    const id=req.params.id
    const product=await ProductModal.find({_id:id})
    if(!product){
        return res.status(404).json({
            success:false,
            message:"No Product found"
        })
    }
     res.status(200).json({
            success:true,
            message:"Product retrive success",
            Product:product
        })
}