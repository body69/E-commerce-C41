import slugify from "slugify";
import brandModel from "../../../DB/model/Brand.model.js";
import categoryModel from "../../../DB/model/Category.model.js";
import subCategoryModel from "../../../DB/model/SubCategory.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import {nanoid} from 'nanoid'
import cloudinary from "../../../utils/cloudinary.js";
import productModel from "../../../DB/model/Product.model.js";

export const createProduct=asyncHandler(
async(req,res,next)=>{
   const{categoryId,subCategoryId,brandId,price,discount}=req.body
   
   if(! await categoryModel.findById({_id:categoryId})){
       return next(new Error("invalid category id",{cause:404}))
   }
   if(! await subCategoryModel.findById({_id:subCategoryId})){
        return next(new Error("invalid subCategoryId ",{cause:404}))
    }
    if(! await brandModel.findById({_id:brandId})){
         return next(new Error("invalid brandId",{cause:404}))
    }
    req.body.slug=slugify(req.body.name,{
        trim:true,
        lowercase:true
    })
    req.body.slug=slugify(req.body.name)
    req.body.finalPrice=price-(price*discount||0)/100
    req.body.customId=nanoid()

    const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}/mainImage`})
    if (!secure_url){
        return next(new Error("image not found",{cause:400}))
    }
    req.body.mainImage={secure_url,public_id}

    if(req.files.subImage.length){
        let images=[]
        for (const image of req.files.subImage) {
            const {secure_url,public_id}=await cloudinary.uploader.upload(image.path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}/subImages`})
            if (!secure_url){
                return next(new Error("image not found",{cause:400}))
            }
           images.push({secure_url,public_id})
        }
        req.body.subImages=images
    }
    
     req.body.createdBy=req.user._id
    const product=await productModel.create(req.body)
    return res.status(201).json({message:"Done",product})
}
)

export const updateProduct=asyncHandler(
async(req,res,next)=>{
    const{productId}=req.params
    const product=await productModel.findById({_id:productId})
    if(!product){
        return next(new Error("invalid product id",{cause:404}))
    }
   
   if(req.body.subCategoryId && ! await subCategoryModel.findById({_id:req.body.subCategoryId})){
        return next(new Error("invalid subCategoryId ",{cause:404}))
    }
    if(req.body.brandId &&! await brandModel.findById({_id:req.body.brandId})){
         return next(new Error("invalid brandId",{cause:404}))
    }
    if(req.body.name){
        req.body.slug=slugify(req.body.name,{
            trim:true,
            lowercase:true
        })
    }
    if(req.body.price&&req.body.discount){
        req.body.finalPrice=req.body.price-(req.body.price*req.body.discount)/100
    }
    else if(req.body.price){
        req.body.finalPrice=req.body.price-(req.body.price*product.discount||0)/100
    }
    else if(req.body.discount){
        req.body.finalPrice=product.price-(product.price*req.body.discount)/100
    }
    // req.body.finalPrice=req.body.price||product.price-(req.body.price||product.price * req.body.discount||product.discount||0 )/100


   if(req.files?.mainImage?.length){
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/${product.customId}/mainImage`})
    if (!secure_url){
        return next(new Error("image not found",{cause:400}))
    }
    await cloudinary.uploader.destroy(product.mainImage.public_id)
    req.body.mainImage={secure_url,public_id}
   }
    
    if(req.files?.subImage?.length){
        for (const image of req.files.subImage) {
            const {secure_url,public_id}=await cloudinary.uploader.upload(image.path,{folder:`${process.env.APP_NAME}/product/${product.customId}/subImages`})
            if (!secure_url){
                return next(new Error("image not found",{cause:400}))
            }
           product.subImages.push({secure_url,public_id})
        }
        req.body.subImages=product.subImages
    }
    
     req.body.updatedBy=req.user._id
    const update=await productModel.findByIdAndUpdate({_id:productId},req.body,{new:true})
    return res.status(201).json({message:"Done",update})
}
)

export const getAllProduct=asyncHandler(
    async(req,res,next)=>{
        const products=await productModel.find({})
        return res.status(200).json({message:"Done",products})
    }
)

export const oneProduct=asyncHandler(
    async(req,res,next)=>{
        const product=await productModel.find({_id:req.params.productId})
        return res.status(200).json({message:"Done",product})
    }
)