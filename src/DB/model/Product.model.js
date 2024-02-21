import mongoose ,{ Schema,Types,model } from "mongoose";

const productSchema= new Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        trim:true,
        lowercase:true,
        min:5,
        max:35

    },
    mainImage:{
        type:Object,
        required:[true,'mainImage is required'],
    },
    subImages:[{
        type:Object,
    }],
    slug:{
        type:String,
        required:[true,'slug is required'],
        trim:true,
        lowercase:true


    },
    description:String,
    color:[String],
    size:[String],
    price:{
        type:Number,
        required:[true,'price is required'],
        min:1
    },
    finalPrice:{
        type:Number,
       
    },
    stock:{
        type:Number,
        required:[true,'stock is required'],
    },
    discount:{
        type:Number,
        default:0
    },

    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:[true,'userId is required']

    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User'
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:[true,'categoryId is required'],

    },
    subCategoryId:{
        type:Types.ObjectId,
        ref:'SubCategory',
        required:[true,'subCategoryId is required'],

    },
    brandId:{
        type:Types.ObjectId,
        ref:'Brand',
        required:[true,'brandId is required'],

    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    customId:{
        type:String,
        required:true
    }
    
},{
    timestamps:true
})

const productModel=mongoose.model.Product || model('Product',productSchema)
export default productModel 