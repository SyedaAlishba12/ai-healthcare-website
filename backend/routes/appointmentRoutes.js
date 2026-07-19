import express from "express";
import {
  createAppointment,
  getAppointmentsByDoctor,
  getAppointmentById,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/doctor/:doctorId", getAppointmentsByDoctor);
router.get("/:id", getAppointmentById);

export default router;
