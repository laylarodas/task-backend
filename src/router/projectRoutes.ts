import { Router } from "express";
import { body, param } from 'express-validator'
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";


const router = Router();

router.use(authenticate)

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
router.param('projectId', projectExists)

router.post('/:projectId/tasks', 
    body('name').notEmpty().withMessage('The task name is required'),
    body('description').notEmpty().withMessage('The description is required'), 
    handleInputErrors,
TaskController.createTask)

router.get('/:projectId/tasks', 
    TaskController.getProjectTasks
)


router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)
router.get('/:projectId/tasks/:taskId', 
    param('taskId').isMongoId().withMessage('invalid ID'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId', 
    param('taskId').isMongoId().withMessage('invalid ID'),
    handleInputErrors,
    body('name').notEmpty().withMessage('The task name is required'),
    body('description').notEmpty().withMessage('The description is required'), 
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId', 
    param('taskId').isMongoId().withMessage('invalid ID'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('invalid ID'),
    body('status').notEmpty().withMessage('The status is required'),
    handleInputErrors,
    TaskController.updateStatus
)

/*** Routes for teams  ***/
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Invalid email'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail

)

router.get('/:projectId/team', TeamMemberController.getProjectTeam)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

export default router;