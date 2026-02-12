const express = require('express');
const authController = require('./auth.controller');
const validate = require('../../shared/middleware/validate');
const { registerSchema, loginSchema } = require('./auth.validation');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
// router.get('/profile', protect, authController.getProfile); // Need protect middleware

module.exports = router;
