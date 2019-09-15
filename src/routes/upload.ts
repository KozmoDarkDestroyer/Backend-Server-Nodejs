import express from 'express';
import { verifyUser, verifyToken } from '../middlewares/indexers';
import UploadCtrl from '../controllers/upload';
const router = express.Router();
const uploadCtrl = new UploadCtrl();

// ========================================================================
// Routes && Controllers
// ========================================================================

router.put('/upload/:table/:id',verifyToken,verifyUser,uploadCtrl.uploadImage);

export default router;
