import { Router } from "express";
import { body, param } from 'express-validator'
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";


const router = Router();

router.post('/',
    body('projectName').notEmpty().withMessage('The project name is required'),
    body('clientName').notEmpty().withMessage('The client name is required'),
    body('description').notEmpty().withMessage('The description is required'),
    handleInputErrors,
ProjectController.createProject)


router.get('/', ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('invalid ID'),
    handleInputErrors,
ProjectController.getProjectById)


export default router