const LabTest = require('../models/LabTest');
const LabBooking = require('../models/LabBooking');

// GET /api/lab-tests
const getAllLabTests = async (req, res) => {
  try {
    const tests = await LabTest.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching lab tests.',
    });
  }
};

// GET /api/lab-tests/:id
const getLabTestById = async (req, res) => {
  try {
    const test = await LabTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching lab test.',
    });
  }
};

// POST /api/lab-tests/book
const bookLabTest = async (req, res) => {
  try {
    const { patientName, email, phone, testId, preferredDate } = req.body;

    // --- Presence validation ---
    if (!patientName || !email || !phone || !testId || !preferredDate) {
      return res.status(400).json({
        success: false,
        message:
          'All fields are required: patientName, email, phone, testId, preferredDate.',
      });
    }

    // --- Past-date validation ---
    const bookingDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // compare date-only (midnight)

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'preferredDate is not a valid date.',
      });
    }

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Preferred date cannot be in the past.',
      });
    }

    // --- Verify the test exists ---
    const labTest = await LabTest.findById(testId);
    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'The selected lab test does not exist.',
      });
    }

    // --- Create booking ---
    const booking = await LabBooking.create({
      patientName,
      email,
      phone,
      testId,
      preferredDate: bookingDate,
    });

    return res.status(201).json({
      success: true,
      data: {
        bookingId: booking._id,
        patientName: booking.patientName,
        email: booking.email,
        testName: labTest.name,
        preferredDate: booking.preferredDate,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    // Mongoose cast error (bad ObjectId for testId)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid testId format.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while booking lab test.',
    });
  }
};

module.exports = {
  getAllLabTests,
  getLabTestById,
  bookLabTest,
};
