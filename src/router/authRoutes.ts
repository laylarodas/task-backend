import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/create-account', 
    body('name')
        .notEmpty().withMessage('Name cannot be empty'),
    body('password')
        .isLength({min: 8}).withMessage('The password is very short, minimum 8 characters'),
    body('password_confirmation').custom((value, {req} )=>{
        if (value !== req.body.password) {
            throw new Error('Passwords are not the same')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('Invalid Email'),
    handleInputErrors,
AuthController.createAccount)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('Token cannot be empty'),
    handleInputErrors,
AuthController.confirmAccount)

router.post('/login',
    body('email')
        .isEmail().withMessage('Invalid Email'),
    body('password')
        .notEmpty().withMessage('Password cannot be empty'),
    handleInputErrors,
AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('Invalid Email'),
    handleInputErrors,
AuthController.requestConfirmationCode
)


export default router