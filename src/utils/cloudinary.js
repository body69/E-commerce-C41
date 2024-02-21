import  cloudinary from 'cloudinary';
import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

export default cloudinary.v2