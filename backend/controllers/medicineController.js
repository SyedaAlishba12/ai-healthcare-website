import Medicine from '../models/Medicine.js';
import HTTP_STATUS from '../constants/httpStatus.js';

// 1. Get all medicines (With Search and Category Filters)
const getAllMedicines = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // if user sselect any other category rather than ALL
    if (category && category !== 'All') {
      query.category = category;
    }

    // If user type something in searchbar (Case-insensitive search)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const medicines = await Medicine.find(query);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not fetch medicines ',
      error: error.message
    });
  }
};

// 2. Get Single Medicine Details by ID
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Medicine did not found in database!'
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Facing error while loading medicine detail',
      error: error.message
    });
  }
};

export {
  getAllMedicines,
  getMedicineById
};