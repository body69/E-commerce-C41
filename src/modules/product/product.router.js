import { Router } from "express";
import * as productController from "./controller/product.controller.js";
import {uploadFileMulter,filevalidtion} from "../../utils/multer.js";
import auth, { roles } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import * as productValidation from './product.validation.js'


const router=Router()

router
    .post('/',
    validation(productValidation.tokenSchema,true),
    auth([roles.User]),
    uploadFileMulter(filevalidtion.image).fields([
        {name:'mainImage',maxCount:1},
        {name:'subImage',maxCount:5}
    ]),
    validation(productValidation.createProductSchema),
    productController.createProduct)
    
    .put('/:productId',
    validation(productValidation.tokenSchema,true),
    auth([roles.Admin]),
    uploadFileMulter(filevalidtion.image).fields([
        {name:'mainImage',maxCount:1},
        {name:'subImage',maxCount:5}
    ]),
    validation(productValidation.updateProductSchema),
    productController.updateProduct)

    .get('/',productController.getAllProduct)
    .get('/:productId',
    validation(productValidation.OneProductSchema),
    productController.oneProduct)
  
        



export default router