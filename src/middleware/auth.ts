import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import User, { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }

}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        const error =  new Error('Unauthorized')
        res.status(401).json({ message: error.message })
    }

    const [, token] = bearer.split(' ')
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(typeof decoded === 'object') {
            const user = await User.findById(decoded.id).lean().select('_id name email')
            if(user) {
                req.user = user
                next()
            }else{
                res.status(401).json({ error: 'Invalid Token' })
            }
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Invalid Token' })
    }

    
}