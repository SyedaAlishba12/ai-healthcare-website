import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

// @desc    Create a new appointment
// @route   POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { doctor, patientName, patientEmail, patientPhone, appointmentDate, timeSlot, notes } = req.body;

    if (!doctor || !patientName || !patientEmail || !patientPhone || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Missing required appointment fields",
      });
    }

    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointment = await Appointment.create({
      doctor,
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      timeSlot,
      notes,
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};

// @desc    Get all appointments for a specific doctor
// @route   GET /api/appointments/doctor/:doctorId
export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId }).sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

// @desc    Get a single appointment by ID
// @route   GET /api/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("doctor");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
      error: error.message,
    });
  }
};
