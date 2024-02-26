import { Router } from "express";
import * as couponController from "./controller/coupon.controller.js";
import * as couponValidation from './coupon.validation.js'
import validation from "../../middleware/validation.js";
import {uploadFileMulter,filevalidtion} from "../../utils/multer.js";
import auth, { roles } from "../../middleware/auth.js";


const router=Router()

router
    .post('/',
    auth([roles.User]),
    uploadFileMulter(filevalidtion.image).single('image'),
    validation(couponValidation.createCouponSchema),
    couponController.createCoupon
    )

    .get('/',
    couponController.allCoupon
    )

    .get('/:couponId',
    validation(couponValidation.getCouponSchema),
    couponController.getCoupon
    )

    .put('/:couponId',
    uploadFileMulter(filevalidtion.image).single('image'),
    validation(couponValidation.updateCouponSchema),    
    couponController.updateCoupon
    )


export default router