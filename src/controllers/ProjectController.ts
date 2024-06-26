import type { Request, Response } from "express";
import Project from "../models/Project";


export class ProjectController {
    //static methods
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)

        //add manager to project
        project.manager = req.user._id

        console.log(req.user)
        try {
            await project.save()
            res.send('Project created successfully')
        } catch (error) {
            console.log(error)
        }
        
    }

    static getAllProjects = async (req: Request, res: Response) => {
        
        try {

            const projects= await Project.find({
                $or: [
                    {manager: { $in: req.user._id }},
                    {team: { $in: req.user._id }}
                ]
            })

            res.json(projects)

        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')

            if (!project) {
                const error = new Error('Project not found');
                return res.status(404).json({error: error.message})
            }

            if (project.manager.toString() !== req.user._id.toString() && !project.team.includes(req.user._id.toString())) {
                const error = new Error('Invalid action');
                return res.status(404).json({error: error.message})
            }
            res.json(project)

        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)

            if (!project) {
                const error = new Error('Project not found');
                return res.status(404).json({error: error.message})
            }

            if (project.manager.toString() !== req.user._id.toString()) {
                const error = new Error('Only the manager can update the project');
                return res.status(404).json({error: error.message})
            }


            project.clientName =  req.body.clientName
            project.projectName =  req.body.projectName
            project.description =  req.body.description
            await project.save();

            res.send('Updated project')

        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)

            if (!project) {
                const error = new Error('Project not found');
                return res.status(404).json({error: error.message})
            }

            if (project.manager.toString() !== req.user._id.toString()) {
                const error = new Error('Only the manager can delete the project');
                return res.status(404).json({error: error.message})
            }

            await project.deleteOne();
            res.send('Deleted project')
            
        } catch (error) {
            console.log(error)
        }
    }

}