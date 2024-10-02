import express from 'express';
import { 
  createProject, 
  getAllProjects, 
  getProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

router.route('/').get(getAllProjects); // No JWT required here
router.route('/:id').get(getProject); // No JWT required here

router.use(verifyJWT); 
router.route('/')
  .post(createProject)
  .put(updateProject); 

router.route('/:id')
  .delete(deleteProject); 

export default router;
