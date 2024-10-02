import express from 'express';
import { 
  createSkill, 
  getAllSkills, 
  getSkill, 
  updateSkill, 
  deleteSkill 
} from '../controllers/skillController.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

router.route('/').get(getAllSkills); // No JWT required here
router.route('/:id').get(getSkill); // No JWT required here

router.use(verifyJWT); 
router.route('/')
  .post(createSkill)
  .put(updateSkill); 

router.route('/:id')
  .delete(deleteSkill);  // Delete a Skill by ID

export default router;
