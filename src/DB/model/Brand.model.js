import mongoose ,{ Schema,Types,model } from "mongoose";

const brandSchema= new Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        unique:[true,'catogary name must be unique value'],
        trim:true,
        lowercase:true


    },
    image:{
        type:Object,
        required:[false,'image is required'],
    },
    slug:{
        type:String,
        required:[true,'slug is required'],
        unique:[true,'slug must be unique value'],
        trim:true,
        lowercase:true


    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:[true,'userId is required']

    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


const brandModel=mongoose.model.Brand || model('Brand',brandSchema)
export default brandModel 