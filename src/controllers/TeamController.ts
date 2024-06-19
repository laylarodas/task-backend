import type { Request, Response } from 'express';
import User from '../models/User';

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body;

        // Find the user with the email
        const user = await User.findOne({email: email}).select('id name email');

        if (!user) {
            const error = new Error('User not found');
            return res.status(404).json({error: error.message   })
        }

        res.json(user)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body;

        const user = await User.findById(id).select('id');

        if (!user) {
            const error = new Error('User not found');
            return res.status(404).json({error: error.message   })
        }

        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('User already in the team');
            return res.status(409).json({error: error.message   })
        }

        req.project.team.push(user.id);
        await req.project.save();

        res.send('User added to the team successfully')
    }












    
}