import express from 'express';
import UserCtrl from '../controllers/user';
import { verifyAdmin, verifyUser, verifyToken } from '../middlewares/indexers';
const router = express.Router();
const userCtrl = new UserCtrl();

// ===========================================
// Routes && Controllers
// ===========================================

router.get('/users', verifyToken,verifyUser,userCtrl.getUsers);
router.get('/user/:id',verifyToken,verifyUser,userCtrl.getUser);
router.post('/user',userCtrl.createUser);
router.put('/user/:id',verifyUser,userCtrl.putUser);
router.delete('/user/:id',verifyAdmin,userCtrl.deleteUser);

export default router;