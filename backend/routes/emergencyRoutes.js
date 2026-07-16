import express from "express";
import { getEmergencyContacts } from "../controllers/emergencyController.js";

const router = express.Router();

/*
 Emergency Contact Routes
*/

// Get All Emergency Contacts
// Optional Filter: ?type=ambulance
router.get("/", getEmergencyContacts);

export default router;