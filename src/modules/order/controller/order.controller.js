import couponModel from "../../../DB/model/Coupon.model.js";
import orderModel from "../../../DB/model/Order.model.js";
import productModel from "../../../DB/model/Product.model.js";
import cartModel from "../../../DB/model/cart.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createOrder=asyncHandler(
    async(req,res,next)=>{
        let {products,couponName}=req.body
        const {_id}=req.user
        const cart=await cartModel.findOne({userId:_id})
        if(!cart?.products?.length){
            return next(new Error('invalid cart id',{cause:404}))
        }
        let coupon={amount:0};
        if(couponName){
                 coupon=await couponModel.findOne({name:couponName,usedBy:{$nin:_id}})
            if(!coupon){
                return next(new Error('invalid coupon',{cause:404}))
            }
            if(coupon.expireIn.getTime()<new Date()){
                return next(new Error('expired coupon',{cause:400}))
            }
        }
        if(!products?.length){
            products=cart.products.toObject()
        }
        const allProducts=[]
        let subPrice=0
        for (const product of products) {
            const productExist=await productModel.findOne({_id:product.productId,isDeleted:false,stock:{$gte:product.quantity}})
            if(!productExist){
                return next(new Error('invalid product',{cause:400}))
            }
            product.name=productExist.name
            product.unitPrice=productExist.finalPrice
            product.totalPrice=productExist.finalPrice*product.quantity
            allProducts.push(product)
            subPrice+=product.totalPrice
        }
        for (const product of products){
            await cartModel.updateOne({userId:_id},{
                 $pull:{
                    products:{
                        productId:{$in:product.productId}
                 }
            }}
            )
            await productModel.updateOne({_id:product.productId},{$inc:{stock:- parseInt(product.quantity)}})
        }
        req.body.products=allProducts
        req.body.subPrice=subPrice
        req.body.finalPrice=subPrice-(subPrice*coupon.amount)/100
        const order=await orderModel.create(req.body)
        if(couponName){
            await couponModel.updateOne({_id:coupon._id},{$push:{usedBy:_id}})
        }
        return res.status(201).json({message:'done',order})
    }
)

export const cancelOrder=asyncHandler(
    async(req,res,next)=>{
        const {orderId}=req.params
        const order=await orderModel.findById({_id:orderId})
        if(!order){
            return next(new Error('invalid order ',{cause:404}))
        }
        if(order.status !='placed' && order.status!='waitForPayment'){
            return next(new Error('invalid cancel order',{cause:400}))
        }
        for (const product of order.products) {
            await productModel.updateOne({_id:product.productId},{$inc:{stock:parseInt(product.quantity)}})

        }
        if(order.couponId){
            await couponModel.updateOne({_id:order.couponId},{$pull:{usedBy:req.user._id}})
        }
        const updateOrder=await orderModel.updateOne({_id:orderId},{status:"canceled",updatedBy:req.user._id})
        return res.status(200).json({message:"Done",updateOrder})
    }
)

export const deliveredOrder=asyncHandler(
    async(req,res,next)=>{
        const {orderId}=req.params
        const order=await orderModel.findById({_id:orderId})
        if(!order){
            return next(new Error('invalid order ',{cause:404}))
        }
        if(order.status !='onWay' ){
            return next(new Error('invalid deliver order',{cause:400}))
        }
       
        const updateOrder=await orderModel.updateOne({_id:orderId},{status:"delivered",updatedBy:req.user._id})
        return res.status(200).json({message:"Done",updateOrder})
    }
)