import { Router } from "express";
import * as subCategoryController from "./controller/subCategory.controller.js";
import {uploadFileMulter,filevalidtion} from "../../utils/multer.js";

const router=Router({mergeParams:true})
import validation from "../../middleware/validation.js";
import * as subCategoryValidation from './subCategory.validation.js'
import auth, { roles } from "../../middleware/auth.js";


router
    .post('/',
    auth(roles.User),
    uploadFileMulter(filevalidtion.image).single('image'),
    validation(subCategoryValidation.createSubCategorySchema),
        subCategoryController.createSubCatogary
    )

    .get('/',
        subCategoryController.allSubCategories
    )

    .get('/:subCategoryId',
    // validation(subCategoryValidation.getSubCategorySchema),

    subCategoryController.getSubCatogary
    )

    .put('/:subCategoryId',
    uploadFileMulter(filevalidtion.image).single('image'),
    // validation(subCategoryValidation.updateSubCategorySchema),

    subCategoryController.updateSubCatogary
    )


export default router