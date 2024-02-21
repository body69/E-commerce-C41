import { Router } from "express";
import * as userController from "./controller/user.controller.js";
import auth, { roles } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import * as userValidation from './user.validation.js'


const router=Router()

router
    .patch('/addToWishList/:productId',
    // validation(userValidation.tokenSchema,true),
    auth([roles.Admin]),
    // validation(orderValidation.createOrderSchema),
    userController.addToWishList)
    
    .patch('/removeFromWishList/:productId',
    // validation(userValidation.tokenSchema,true),
    auth([roles.Admin]),
    // validation(orderValidation.createOrderSchema),
    userController.removeFromWishList)
    
  
   

export default router