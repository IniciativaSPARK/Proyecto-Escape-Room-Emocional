import { Router } from 'express';
import { 
    create,
    getUsers, 
    getUser, 
    updateRole, 
    remove, 
    update 
} from '../controllers/userController.js';

const router = Router();

router.post('/users', create);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/role', updateRole);
router.delete('/users/:id', remove);
router.put('/users/:id', update);

export default router;