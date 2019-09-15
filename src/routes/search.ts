import express from 'express';
import SearchCtrl from '../controllers/search';
const router = express.Router();
const searchCtrl = new SearchCtrl();

// ===========================================
// Routes && Controllers
// ===========================================

router.get('/search/:table/:parameter',searchCtrl.searchCollections);
router.get('/search/:parameter',searchCtrl.searchAll);

export default router;