
import type { Request, Response } from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'

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

            //generate token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Account created, check your email to confirm')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if (!tokenExists) {
                const error = new Error('Token not found')
                return res.status(401).json({error: error.message})
            }
            
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }

    }
}