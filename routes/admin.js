import express from "express";
import { addBus, agentList, inviteAgent, seatAsign, verifyMail } from "../controllers/adminControllers.js";
import { verifyToken } from "../middleware/authToken.js";
const router = express.Router();

// * ADMIN LOGIN *//

//* SEND INVITATION & VERIFY*//
router.post("/invite", verifyToken, inviteAgent);
router.get("/verify-token/:generateCode", verifyMail);

//* GET AGENT LIST *//
router.get("/agents-list", verifyToken, agentList);

//* ADD BUS *//
router.post("/add-bus", verifyToken, addBus);

//*  ASSIGN SEATS  *//
router.patch("/book-seats", verifyToken, seatAsign);

export default router;
