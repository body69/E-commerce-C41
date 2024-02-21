import couponModel from "../../../DB/model/Coupon.model.js";
import cloudinary from "../../../utils/cloudinary.js"
import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})
import { asyncHandler } from "../../../utils/errorHandling.js";


export const createCoupon=asyncHandler(
    async(req,res,next)=>{
        const{name}=req.body
    
        
        if (await couponModel.findOne({name})){
        //    return res.status(409).json({message:"name already exist"})
          return next(new Error("name already exist",{cause:409}))
    
        }
        if (req.file){
            const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/coupon`})
             if (!secure_url){
         return next(new Error("image not found",{cause:400}))

        // return res.status(400).json({message:"image not found"})
            }
            req.body.image={secure_url,public_id}

        }
        req.body.createdBy=req.user._id

        const coupon=await couponModel.create(req.body)
        return res.status(201).json({message:"Done",coupon})
    })


export const allCoupon=asyncHandler(async(req,res,next)=>{
    const coupons =await couponModel.find()
    return res.status(200).json({message:"Done",coupons})

})

export const getCoupon=asyncHandler(async(req,res,next)=>{
    const {couponId}=req.params
    const coupon =await couponModel.findById({_id:couponId})
    return res.status(200).json({message:"Done",coupon})

})

export const updateCoupon=asyncHandler(async(req,res,next)=>{
    const {couponId}=req.params

    const couponExist= await couponModel.findById({_id:couponId})
    if(!couponExist){
        return next(new Error("invalid coupon id",{cause:404}))
        // return res.status(404).json({message:"invalid category id"})

    }
    if(req.body.name){
        if(await couponModel.findOne({name:req.body.name})){
            return next(new Error("name already exist",{cause:409}))
            // return res.status(409).json({message:"name already exist"})
        }
    }
    if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/coupon`})
        if (!secure_url){
            return next(new Error("image not found",{cause:400}))

            // return res.status(400).json({message:"image not found"})
    
        }
        if (couponExist.image?.public_id){
            await cloudinary.uploader.destroy(couponExist.image.public_id)
        }
       
        req.body.image={secure_url,public_id}
    }
    // req.body.updatedBy=req.user._id
    const newCoupon=await couponModel.findByIdAndUpdate({_id:couponId},req.body)
    return res.status(200).json({message:"Done",coupon:newCoupon})
    
})
