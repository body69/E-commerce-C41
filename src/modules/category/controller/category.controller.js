import categoryModel from "../../../DB/model/Category.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})
import { asyncHandler } from "../../../utils/errorHandling.js"
import slugify from "slugify"


export const createCategory=asyncHandler(async(req,res,next)=>{
    const{name}=req.body

    
    if (await categoryModel.findOne({name})){
    //    return res.status(409).json({message:"name already exist"})
      return next(new Error("name already exist",{cause:409}))

    }
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`})
    if (!secure_url){
        return next(new Error("image not found",{cause:400}))

        // return res.status(400).json({message:"image not found"})

    }
    req.body.slug=slugify(name)
    req.body.image={secure_url,public_id}
    req.body.createdBy=req.user._id
    const category=await categoryModel.create(req.body)
    return res.status(201).json({message:"Done",category})
})


export const allCategories=asyncHandler(async(req,res,next)=>{
    const categories =await categoryModel.find()
    .populate([
        {
            path:'subCategory'
        }
    ])
    return res.status(200).json({message:"Done",categories})

})

export const getCategory=asyncHandler(async(req,res,next)=>{
    const {categoryId}=req.params
    const category =await categoryModel.findOne({_id:categoryId})
    .populate([
        {
            path:'subCategory'
        }
    ])
    return res.status(200).json({message:"Done",category})

})


export const updateCategory=asyncHandler(async(req,res,next)=>{
    const {categoryId}=req.params

    const categoryExist= await categoryModel.findById({_id:categoryId})
    if(!categoryExist){
        return next(new Error("invalid category id",{cause:404}))
        // return res.status(404).json({message:"invalid category id"})

    }
    if(req.body.name){
        if(await categoryModel.findOne({name:req.body.name})){
            return next(new Error("name already exist",{cause:409}))
            // return res.status(409).json({message:"name already exist"})
        }
        req.body.slug=slugify(req.body.name)
    }
    if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`})
        if (!secure_url){
            return next(new Error("image not found",{cause:400}))

            // return res.status(400).json({message:"image not found"})
    
        }
        await cloudinary.uploader.destroy(categoryExist.image.public_id)
        req.body.image={secure_url,public_id}
    }
    req.body.updatedBy=req.user._id

    const newCategory=await categoryModel.findByIdAndUpdate({_id:categoryId},req.body,{new:true})
    return res.status(200).json({message:"Done",category:newCategory})
    
})

// export const updateCategory = 
//     async (req, res, next) => {
//       const { categoryId } = req.params;
//       const category = await categoryModel.findById({ _id: categoryId });
//       if (!category) {
//         return next(new Error("Category Not Found",{cause:404}))
//       }
  
//       if (req.body.name) {
//         if (await categoryModel.findOne({ name: req.body.name })) {
//           return next(new Error("Name Already Exist",{cause:409}))
//         }
//         req.body.slug = slugify(req.body.name);
//       }
  
//       if (req.file) {
//         const { secure_url, public_id } = await cloudinary.uploader.upload(
//           req.file.path,
//           { folder: `${process.env.APP_NAME}/Cateory` }
//         );
//         if (!secure_url) {
//           return next(new Error("Iamge Not Found", { cause: 400 }));
//         }
//         req.body.Image = { secure_url, public_id };
//         await cloudinary.uploader.destroy(category.Image.public_id);
//       }
//       const updatedCategory = await categoryModel.findOneAndUpdate(
//         { _id: categoryId },
//         req.body,
//         { new: true }
//       );
//       return res.status(200).json({ message: "Done", updatedCategory });
//     }
  