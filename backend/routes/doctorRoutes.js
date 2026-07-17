const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
} = require("../controllers/doctorController");

router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.post("/", createDoctor);

module.exports = router;
