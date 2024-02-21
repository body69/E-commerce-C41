import brandModel from "../../../DB/model/Brand.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})
import { asyncHandler } from "../../../utils/errorHandling.js"
import slugify from "slugify"


export const createBrand=asyncHandler(async(req,res,next)=>{
    const{name}=req.body

    
    if (await brandModel.findOne({name})){
    //    return res.status(409).json({message:"name already exist"})
      return next(new Error("name already exist",{cause:409}))

    }
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/brand`})
    if (!secure_url){
        return next(new Error("image not found",{cause:400}))

        // return res.status(400).json({message:"image not found"})

    }
    const slug=slugify(name)
    req.body.slug=slug
    req.body.createdBy=req.user._id
    req.body.image={public_id,secure_url}
    const brand=await brandModel.create(req.body)
    return res.status(201).json({message:"Done",brand})
})

export const allBrands=asyncHandler(async(req,res,next)=>{
    const brands =await brandModel.find()
   
    return res.status(200).json({message:"Done",brands})

})

export const getBrandById=asyncHandler(async(req,res,next)=>{
    const {brandId}=req.params
    const brand =await brandModel.findOne({_id:brandId})
    
    return res.status(200).json({message:"Done",brand})

})


export const updateBrand=asyncHandler(async(req,res,next)=>{
    const {brandId}=req.params

    const brandExist= await brandModel.findById({_id:brandId})
    if(!brandExist){
        return next(new Error("invalid brand id",{cause:404}))
        // return res.status(404).json({message:"invalid category id"})

    }
    if(req.body.name){
        if(await brandModel.findOne({name:req.body.name})){
            return next(new Error("name already exist",{cause:409}))
            // return res.status(409).json({message:"name already exist"})
        }
        req.body.slug=slugify(req.body.name)
    }
    if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/brand`})
        if (!secure_url){
            return next(new Error("image not found",{cause:400}))

            // return res.status(400).json({message:"image not found"})
    
        }
        await cloudinary.uploader.destroy(brandExist.image.public_id)
        req.body.image={secure_url,public_id}
    }
    req.body.updatedBy=req.user._id

    const newBrand=await brandModel.findByIdAndUpdate({_id:brandId},req.body)
    return res.status(200).json({message:"Done",category:newBrand})
    
})
