import { Router } from "express";
import { body, param } from 'express-validator'
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";


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

router.put('/:id', 
    param('id').isMongoId().withMessage('invalid ID'),
    body('projectName').notEmpty().withMessage('The project name is required'),
    body('clientName').notEmpty().withMessage('The client name is required'),
    body('description').notEmpty().withMessage('The description is required'),
    handleInputErrors,
ProjectController.updateProject)

router.delete('/:id', 
    param('id').isMongoId().withMessage('invalid ID'),
    handleInputErrors,
ProjectController.deleteProject)


/***  Routes for tasks  ***/
router.param('projectId', validateProjectExists)

router.post('/:projectId/tasks', 
    validateProjectExists,  
    body('name').notEmpty().withMessage('The task name is required'),
    body('description').notEmpty().withMessage('The description is required'), 
    handleInputErrors,
TaskController.createTask)

router.get('/:projectId/tasks', 
    validateProjectExists,
    TaskController.getProjectTasks
)

router.get('/:projectId/tasks/:taskId', 
    validateProjectExists,
    param('taskId').isMongoId().withMessage('invalid ID'),
    handleInputErrors,
    TaskController.getTaskById
)

export default router;