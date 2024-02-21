import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})

export const generateToken=({payload={},signature=process.env.TOKEN_SIGNATURE,expiresIn=60*60}={})=>{
    const token=jwt.sign(payload,signature,{expiresIn:parseInt(expiresIn)});
    return token
}

export const verifyToken=({token,signature=process.env.TOKEN_SIGNATURE}={})=>{
    const decoded=jwt.verify(token,signature);
    return decoded
}