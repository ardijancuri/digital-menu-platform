import express from 'express';
import { submitApplication } from '../controllers/applicationController.js';
import { applicationValidation } from '../utils/validators.js';

const router = express.Router();

// Submit application
router.post('/apply', applicationValidation, submitApplication);

export default router;
