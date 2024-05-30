
import type { Request, Response } from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {

            const { password, email } = req.body

            //Check if user exists
            const userExists = await User.findOne({email})
            if (userExists) {
                const error = new Error('User is already registered')
                return res.status(409).json({error: error.message})
            }

            //Create user
            const user = new User(req.body)

            //Hash password
            
            user.password = await hashPassword(password)

            await user.save()

            res.send('Account created, check your email to confirm')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }
}