import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.post("/", createDoctor);

export default router;
