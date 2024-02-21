import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})

export const hash=({plaintext,salt=+process.env.SALT_ROUND}={})=>{
    const hashResult=bcrypt.hashSync(plaintext,parseInt(salt))
    return hashResult
}

export const compare=({plaintext,hashValue}={})=>{
    const match=bcrypt.compareSync(plaintext,hashValue)
    return match
}