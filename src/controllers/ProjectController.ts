import type { Request, Response } from "express";


export class ProjectController {
    //static methods
    static getAllProjects = async (req: Request, res: Response) => {
        res.send('All projects')
    }

}