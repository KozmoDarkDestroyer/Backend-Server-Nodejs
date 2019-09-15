import express from 'express';
import LoginCtrl from '../controllers/login';
const router = express.Router();
const loginCtrl = new LoginCtrl();

// ===========================================
// Routes && Controllers
// ===========================================

router.post('/login',loginCtrl.login);

export default router;