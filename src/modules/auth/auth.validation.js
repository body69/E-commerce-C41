import joi from "joi";
import generalFields from "../../utils/generalFields.js";

export const signUpSchema=joi.object({
    userName:joi.string().min(2).max(20).required(),
    email:generalFields.email,
    password:generalFields.password,
    cpassword:joi.string().valid(joi.ref('password')).required(),
    file:generalFields.file,
    phone:joi.string(),

}).required()

export const logInSchema=joi.object({
    email:generalFields.email,
    password:generalFields.password,
}).required()

export const tokenSchema=joi.object({
   token:joi.string().required()
}).required()