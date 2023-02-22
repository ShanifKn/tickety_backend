import express from "express";
import { addBooking, getAvaiable, getBookedSeats, getBusList } from "../controllers/agentControllers.js";
import { verifyToken } from "../middleware/authToken.js";

const router = express.Router();

//* FETCH BUS LIST *//
router.get("/bus-list", verifyToken, getBusList);

//* FETCH SEATS AVAILABLE *//
router.get("/seats", verifyToken, getAvaiable);

//*  BOOKIING REQUEST *//
router.post("/booking", verifyToken, addBooking);

//* FETCH COMPLETE BOOKED SEATS *//
router.get("/booked-seats", verifyToken, getBookedSeats);

export default router;
