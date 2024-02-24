import { Router } from "express";
import * as brandController from "./controller/brand.controller.js";
import {uploadFileMulter,filevalidtion} from "../../utils/multer.js";

import * as brandValidation from './brand.validation.js'
import validation from "../../middleware/validation.js";
import auth, { roles } from "../../middleware/auth.js";


const router=Router()

router
        .post('/',
        auth(roles.User),
        uploadFileMulter(filevalidtion.image).single('image'),
            validation(brandValidation.createBrandSchema),
            brandController.createBrand
        )

        .get('/',
            brandController.allBrands
        )

        .get('/:brandId',
        validation(brandValidation.getBrandSchema),
        brandController.getBrandById
        )

        .put('/:brandId',
        uploadFileMulter(filevalidtion.image).single('image'),    
        validation(brandValidation.updateBrandSchema),
        brandController.updateBrand
        )
    




export default router