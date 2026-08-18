import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Product name is must"],
        trim:true,
    },
    description:{
        type:String,
        required:[true,"Product description is must"],
    },
    price:{
        type:Number,
        required:[true,"Product Price is must"]
    },
    category:{
        type:String,
        required:[true,"Product category is must"],
        trim:true,
        enum:{
            values:['Electronics', 'Clothing', 'Books', 'Home Goods'],
            message:'{value} is not valid category'
        }
    },
    
    brand:{
        type:String,
        required:[true,"Product brand is must"],
        trim:true,
    },
    discount:{
        type:String,
        default:0
    },
    stock:{
        type:Number,
        default:0
    },
     rating:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
     isAvailable:{
        type:Boolean,
         enum:{
            values:[true,false,'coming soon'],
            message:'{value} is not valid category'
        },
        default:true
    },
},{timestamps:true})

export const ProductModal=mongoose.model("Product",productSchema)