import { Router } from 'express';
import { getLanguages } from '../controllers/language.controller.js';

const router = Router();

router.get('/', getLanguages);

export default router;
