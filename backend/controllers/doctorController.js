const Doctor = require("../models/Doctor");

// @desc    Get all doctors (supports ?specialization= and ?search= query params)
// @route   GET /api/doctors
const getAllDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    const filter = {};

    if (specialization && specialization !== "All") {
      filter.specialization = specialization;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const doctors = await Doctor.find(filter).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
};

// @desc    Get a single doctor by ID
// @route   GET /api/doctors/:id
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
      error: error.message,
    });
  }
};

// @desc    Create a doctor (used for seeding/testing — remove or protect before production)
// @route   POST /api/doctors
const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create doctor",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
};
