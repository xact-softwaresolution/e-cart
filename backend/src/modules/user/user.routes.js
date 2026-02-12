const express = require('express');
const userController = require('./user.controller');
const { protect } = require('../../shared/middleware/auth');
const validate = require('../../shared/middleware/validate');
const { z } = require('zod');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);

// Address validation schema
const addressSchema = z.object({
  body: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
    isDefault: z.boolean().optional()
  })
});

router.post('/addresses', validate(addressSchema), userController.addAddress);
router.get('/addresses', userController.getMyAddresses);

module.exports = router;
