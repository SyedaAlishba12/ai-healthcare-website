import express from "express";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

/*
 Contact Routes
*/

// Submit Contact Form
router.post("/", submitContactForm);

export default router;