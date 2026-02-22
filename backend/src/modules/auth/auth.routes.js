const express = require("express");
const authController = require("./auth.controller");
const validate = require("../../shared/middleware/validate");
const { protect } = require("../../shared/middleware/auth");
const { registerSchema, loginSchema } = require("./auth.validation");

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/profile", protect, authController.getProfile);

// token refresh endpoint (uses httpOnly cookie)
router.get("/refresh", authController.refresh);
// logout clears cookies and revokes refresh token
router.post("/logout", protect, authController.logout);

module.exports = router;
