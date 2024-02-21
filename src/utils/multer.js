// import multer from "multer";


// export const fileValidtion={
// image:['image/png','image/jpeg','image/gif','image/jpg'],
// pdf:['application/pdf']
// }

// export const uploadFile=({customValidtion}={})=>{


//     const storage=multer.diskStorage({})
//         const fileFilter=(req,file,cb)=>{
//             if(customValidtion.includes(file.mimetype)){
//                 cb(null,true);
//             }
//             else{
//                 cb(new Error("Invalid Format"),false);
//             }
//         }

//     const upload=multer({fileFilter,storage})
//     return upload
// }

import multer from 'multer'

export const filevalidtion={
    image:['image/png','image/jpeg','image/gif','image/jpeg'],
    pdf:['application/pdf']
    }
    
   export const uploadFileMulter=(customValidtion)=>{
        const storage=multer.diskStorage({})
            const fileFilter=(req,file,cb)=>{
                if(customValidtion.includes(file.mimetype)){
                    cb(null,true);
                }
                else{
                    cb(new Error("Invalid Format"),false);
                }
            }
    
        const upload=multer({fileFilter,storage})
        return upload
    }
    
     