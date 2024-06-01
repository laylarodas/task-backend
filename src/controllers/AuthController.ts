
import type { Request, Response } from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {

            const { password, email } = req.body

            //Check if user exists
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('User is already registered')
                return res.status(409).json({ error: error.message })
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
            res.status(500).json({ error: 'There was an error' })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token not found')
                return res.status(401).json({ error: error.message })
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('Account confirmed')

        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }

    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('User not found')
                return res.status(404).json({ error: error.message })
            }

            if (!user.confirmed) {

                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('User not confirmed, check your email')
                return res.status(404).json({ error: error.message })
            }


            const passwordMatch = await checkPassword(password, user.password)
            if (!passwordMatch) {
                const error = new Error('Invalid password')
                return res.status(401).json({ error: error.message })
            }

            res.send('Logged in')

        
        } catch (error) {
            res.status(500).json({ error: 'There was an error' })
        }
    }
}