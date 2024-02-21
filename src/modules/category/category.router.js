import { Router } from "express";
import * as categoryController from "./controller/category.controller.js";
import {uploadFileMulter,filevalidtion} from "../../utils/multer.js";
import categoryEndPoints from "./category.endPoint.js";

import * as categoryValidation from './category.validation.js'
import subCategoryRouter from '../subCategory/subCategory.router.js'
import validation from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
// import validation from "../../middleware/validation.js";


const router=Router()

router
        .post('/',
        validation(categoryValidation.tokenSchema,true),
        auth(categoryEndPoints.create),
        uploadFileMulter(filevalidtion.image).single('image'),
            validation(categoryValidation.createCategorySchema),
            categoryController.createCategory
        )

        .get('/',
            categoryController.allCategories
        )

        .get('/:categoryId',
        validation(categoryValidation.getCategorySchema),
        categoryController.getCategory
        )

        .put('/:categoryId',
        auth(categoryEndPoints.update),
        uploadFileMulter(filevalidtion.image).single('image'),    
        validation(categoryValidation.updatecategorySchema),
        categoryController.updateCategory
        )
    

    .use('/:categoryId/subCategory',subCategoryRouter)



export default router