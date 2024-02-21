import userModel from "../../../DB/model/User.model.js";
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { compare, hash } from "../../../utils/hashAndComparePassword.js";
import sendEmail from "../../../utils/sendEmail.js";

export const signUp=asyncHandler(async(req,res,next)=>{
    const{email}=req.body
    const user=await userModel.findOne({email})

    if (user){
        return next(new Error('email already exist',{cause:409}))
    }

    const token=generateToken({payload:{email},signature:process.env.SIGN_UP_SIGNATURE,expiresIn:60*60})
    const rfToken=generateToken({payload:{email},signature:process.env.SIGN_UP_SIGNATURE,expiresIn:60*60*24})

    const link=`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const rfLink=`${req.protocol}://${req.headers.host}/auth/refreashToken/${rfToken}`
    const html=`<a href='${link}'>confirm Email</a>
    <br/><br/>
    <a href='${rfLink}'>refresh token</a>
    `
    if(!sendEmail({to:email,subject:'confirm Email',html})){
        return next(new Error('invalid Email',{cause:404}))
    }

     req.body.password = hash({plaintext:req.body.password})

     const newUser=await userModel.create(req.body)

     return res.status(201).json({message:'done',user:newUser._id})
}
)

export const confirmEmail=asyncHandler(
    async(req,res,next)=>{
        const{token}=req.params
        const{email}=verifyToken({token,signature:process.env.SIGN_UP_SIGNATURE})
        if(!email){
           return res.redirect('https://www.youtube.com/')//signUp
        }
        const user=await userModel.findOne({email})
        if(!user){
            return res.redirect('https://www.youtube.com/')//signUp
        }
        if(user.confirmEmail){
            return res.redirect('https://www.google.com/')//login
        }
        await userModel.updateOne({email},{confirmEmail:true})
        return res.redirect('https://www.google.com/')//login
    }
)
    
export const refreashToken=asyncHandler(
    async(req,res,next)=>{
        const{token}=req.params
        const{email}=verifyToken({token,signature:process.env.SIGN_UP_SIGNATURE})
        if(!email){
           return res.redirect('https://www.youtube.com/')//signUp
        }
        const user=await userModel.findOne({email})
        if(!user){
            return res.redirect('https://www.youtube.com/')//signUp
        }
        if(user.confirmEmail){
            return res.redirect('https://www.google.com/')//login
        }
        const newToken=generateToken({payload:{email},signature:process.env.SIGN_UP_SIGNATURE,expiresIn:60*10})
        const link=`${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`
        const html=`<a href='${link}'>confirm Email</a>`
        if(!sendEmail({to:email,subject:'confirm Email',html})){
            return next(new Error('invalid Email',{cause:404}))
        }
        return res.send('<h1>Check Email</h1>')
    
       
    }
)

export const logIn=asyncHandler(
    async(req,res,next)=>{
        const {email,password}=req.body
        const emailExist=await userModel.findOne({email})
        if(!emailExist){
            return next(new Error('invalid email or password',{cause:400}))
        }
        if(!emailExist.confirmEmail){
            return next(new Error('Please,confirm your Email first',{cause:400}))
        }
        if(!compare({plaintext:password,hashValue:emailExist.password})){
            return next(new Error('invalid email or password',{cause:400}))
        }
        const token=generateToken({payload:{email,_id:emailExist._id},signature:process.env.TOKEN_SIGNATURE,expiresIn:60*60})
        const rfToken=generateToken({payload:{email,_id:emailExist._id},signature:process.env.TOKEN_SIGNATURE,expiresIn:60*60*24})
        
        await userModel.updateOne({email},{status:'online'},{new:true})
        return res.status(200).json({message:"Done",token,rfToken})
    }
)