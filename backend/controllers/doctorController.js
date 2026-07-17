import Doctor from "../models/Doctor.js";

export const getAllDoctors = async (req, res) => {
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

export const getDoctorById = async (req, res) => {
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

export const createDoctor = async (req, res) => {
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
