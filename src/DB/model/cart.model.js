import mongoose ,{ Schema,Types,model } from "mongoose";

const cartSchema= new Schema({
   
    userId:{
        type:Types.ObjectId,
        ref:'User',
        require:true,
        unique:true
    },
    products:[
        {
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
            }
           

        }
]
},{
    timestamps:true
})

const cartModel=mongoose.model.Cart || model('Cart',cartSchema)
export default cartModel 