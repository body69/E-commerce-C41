import slugify from "slugify"
import cloudinary from "../../../utils/cloudinary.js"
import subCategoryModel from "../../../DB/model/SubCategory.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import categoryModel from "../../../DB/model/Category.model.js"


export const createSubCatogary=asyncHandler(async(req,res,next)=>{
    const {categoryId}=req.params
    const{name}=req.body
    const category=await categoryModel.findById({_id:categoryId})
    if(!category){
        return next(new Error("invalid categoryId",{cause:404}))
    }

    if (await subCategoryModel.findOne({name})){
      //  return res.status(409).json({message:"name already exist"})
      return next(new Error("name already exist",{cause:409}))

    }
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/${categoryId}/subCategory`})
    if (!secure_url){
        return next(new Error("image not found",{cause:400}))

        // return res.status(400).json({message:"image not found"})

    }
    req.body.image={secure_url,public_id}
    req.body.slug=slugify(name)
    req.body.categoryId=categoryId
    req.body.createdBy=req.user._id


    const subCategory=await subCategoryModel.create(req.body)
    return res.status(201).json({message:"Done",subCategory})
})

export const allSubCategories=asyncHandler(async(req,res,next)=>{
    const {categoryId}=req.params
    const subCategories =await categoryModel.findById(categoryId)
    .populate([
        {
            path:'subCategory'
        }
    ])
    return res.status(200).json({message:"Done",subCategories})

})

export const getSubCatogary=asyncHandler(async(req,res,next)=>{
    const {subCategoryId}=req.params
    const subCategory =await subCategoryModel.findById({_id:subCategoryId}).populate([
        {
            path:'categoryId'
        }
    ])
    return res.status(200).json({message:"Done",subCategory})

})


export const updateSubCatogary=asyncHandler(async(req,res,next)=>{
    const {subCategoryId}=req.params
    const subCategoryExist= await subCategoryModel.findById({_id:subCategoryId})
    if(!subCategoryExist){
        return next(new Error("invalid subCategory id",{cause:404}))
        // return res.status(404).json({message:"invalid subCategory id"})

    }
    if(req.body.name){
        if(await subCategoryModel.findOne({name:req.body.name})){
            return next(new Error("name already exist",{cause:409}))
            // return res.status(409).json({message:"name already exist"})
        }
        req.body.slug=slugify(req.body.name)
    }
    if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/${req.params.categoryId}/subCategory`})
        if (!secure_url){
            return next(new Error("image not found",{cause:400}))
            // return res.status(400).json({message:"image not found"})
    
        }
        await cloudinary.uploader.destroy(subCategoryExist.image.public_id)
        req.body.image={secure_url,public_id}
    }
    req.body.updatedBy=req.user._id


    const newSubCategory=await subCategoryModel.findByIdAndUpdate({_id:subCategoryId},req.body)
    return res.status(200).json({message:"Done",subCategory:newSubCategory})
    
})