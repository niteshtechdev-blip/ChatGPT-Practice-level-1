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