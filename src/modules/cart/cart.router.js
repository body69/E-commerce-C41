import { Router } from "express";
import * as cartController from "./controller/cart.controller.js";
import auth, { roles } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import * as cartValidation from './cart.validation.js'


const router=Router()

router
    .post('/',
    validation(cartValidation.tokenSchema,true),
    auth([roles.User]),
    // validation(productValidation.createProductSchema),
    cartController.addToCart)
   
    .patch('/:productId',
    validation(cartValidation.tokenSchema,true),
    auth([roles.Admin]),
    // validation(productValidation.createProductSchema),
    cartController.deleteFromCart)
    
    .patch('/',
    validation(cartValidation.tokenSchema,true),
    auth([roles.Admin]),
    // validation(productValidation.createProductSchema),
    cartController.clearProductsFromCart)
    
    
  
        

export default router