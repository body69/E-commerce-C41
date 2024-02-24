import { Router } from "express";
import * as orderController from "./controller/order.controller.js";
import auth, { roles } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import * as orderValidation from './order.validation.js'


const router=Router()

router
    .post('/',
    validation(orderValidation.tokenSchema,true),
    auth([roles.User]),
    validation(orderValidation.createOrderSchema),
    orderController.createOrder)
    
    .patch('/:orderId/cancel',
    validation(orderValidation.tokenSchema,true),
    auth([roles.Admin]),
    validation(orderValidation.cancelOrderSchema),
    orderController.cancelOrder)
    
    .patch('/:orderId/delivered',
    validation(orderValidation.tokenSchema,true),
    auth([roles.Admin]),
    validation(orderValidation.cancelOrderSchema),
    orderController.deliveredOrder)
   
   

export default router