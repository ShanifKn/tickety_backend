import express from "express";
import { adminLogin, agentRegister, agentLogin } from "../controllers/auth.js";
import upload from "../middleware/multer-s3.js";





const router = express.Router();

// * ADMIN LOGIN *//
router.post("/admin/login", adminLogin);

//* AGENT REGISTRATION *//
router.post("/agent/register", upload.single("image"), agentRegister);

// * AGENT LOGIN *//
router.post("/agent/login", agentLogin);

export default router;
