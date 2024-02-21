import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
import * as authValidation from "./auth.validation.js";
import validation from "../../middleware/validation.js";


const router=Router()

router
        .post('/signUp',
        validation(authValidation.signUpSchema),
            authController.signUp
        )
        .post('/logIn',
        validation(authValidation.logInSchema),
        authController.logIn)
        
        .get('/confirmEmail/:token',
        validation(authValidation.tokenSchema),
        authController.confirmEmail)

        .get('/refreashToken/:token',
        validation(authValidation.tokenSchema),
        authController.refreashToken)



export default router