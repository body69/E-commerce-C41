import mongoose ,{ Schema,Types,model } from "mongoose";

const userSchema= new Schema({
    userName:{
        type:String,
        required:[true,'userName is required'],
        min:[2,'minimum lenght 2 charcters'],
        max:[20,'max lenght 20 charcetrs'],
        lowercase:true

    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:[true,'email must be unique value'],
        lowercase:true

    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    phone:{
        type:String
    },
    role:{
        type:String,
        default:'user',
        enum:['Admin','user']
    },
    confirmEmail:{
        type:Boolean,
        default:'false'
    },
    status:{
        type:String,
        default:'offline',
        enum:['online','offline']
    },
    gender:{
        type:String,
        default:'male',
        enum:['male','female'],
        lowercase:true

    },
    address:String,
    image:String,
    DOB:String,
    wishList:[{
        type:Types.ObjectId,
        ref:'Product'
    }
]
},{
    timestamps:true,
    
})


const userModel=mongoose.model.User ||model('User',userSchema)
export default userModel 

