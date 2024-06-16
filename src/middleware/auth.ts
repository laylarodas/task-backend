import { NextFunction, Request, Response } from "express";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        const error =  new Error('Unauthorized')
        res.status(401).json({ message: error.message })
    }

    const token = bearer.split(' ')[1]
    console.log(token)

    next()
}