import express from 'express';
import { getQuestionsByCompany, runCode } from '../controllers/question.controller.js';

const router = express.Router();

router.get("/", getQuestionsByCompany);
router.post("/run", runCode);

export default router;
