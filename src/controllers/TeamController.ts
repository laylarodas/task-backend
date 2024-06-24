import type { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';

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

    static getProjectTeam = async (req: Request, res: Response) => {

        const project = await Project.findById(req.project.id).populate({path: 'team', select: 'id name email'});
        

        res.json(project.team)
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

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params;

        if (!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('User not in the team');
            return res.status(409).json({error: error.message   })
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);

        await req.project.save();
      

        res.send('User removed from the team successfully')
    }


    
}