import productModel from "../../../DB/model/Product.model.js";
import userModel from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const addToWishList=asyncHandler(
    async(req,res,next)=>{
        const {productId}=req.params
        const product=await productModel.findById({_id:productId,isDeleted:false})
        if(!product){
            return next(new Error('invalid product',{cause:404}))
        }
        const user=await userModel.findByIdAndUpdate({_id:req.user._id},{$addToSet:{wishList:product._id}},{new:true})
            .select('userName email wishList status').populate([
                {
                    path:'wishList'
                }
            ])
        return res.status(200).json({message:'Done',user})
    }
)



export const removeFromWishList=asyncHandler(
    async(req,res,next)=>{
        const {productId}=req.params
        const product=await productModel.findById({_id:productId,isDeleted:false})
        if(!product){
            return next(new Error('invalid product',{cause:404}))
        }
        const user=await userModel.findByIdAndUpdate({_id:req.user._id},{$pull:{wishList:product._id}},{new:true})
            .select('userName email wishList status').populate([
                {
                    path:'wishList'
                }
            ])
        return res.status(200).json({message:'Done',user})
    }
)