import mongoose ,{ Schema,Types,model } from "mongoose";

const orderSchema= new Schema({
   
    userId:{
        type:Types.ObjectId,
        ref:'User',
        require:true,
    },
    products:[
        {   name:{
                type:String,
                require:true,
                min:5,
                max:35
            },
            productId:{
                type:Types.ObjectId,
                ref:'Product',
                require:true,
                unique:true
            },
            quantity:{
                type:Number,
                require:true,
                min:1
            },
            unitPrice:{
                type:Number,
                require:true,
                min:1
            },
            totalPrice:{
                type:Number,
                require:true,
                min:1
            }
        }
],
address:{
    type:String,
    require:true
},
phone:[{
    type:String,
    require:true
}],
paymentType:{
    type:String,
    enum:['card','cash'],
    default:'cash'
},
finalPrice:{
    type:Number,
    require:true,
    min:1
},
subPrice:{
    type:Number,
    require:true,
    min:1
},
note:String,
couponId:{
    type:Types.ObjectId,
    ref:'Coupon'
},
status:{
    type:String,
    enum:['placed','onWay','canceled','rejected','delivered','waitForPayment'],
    default:'placed'
},
reason:String,
updatedBy:{
    type:Types.ObjectId,
    ref:'User',
}
},{
    timestamps:true
})

const orderModel=mongoose.model.Order || model('Order',orderSchema)
export default orderModel 