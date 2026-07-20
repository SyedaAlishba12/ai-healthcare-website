import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import HTTP_STATUS from '../constants/httpStatus.js';

// @desc    Create a new order from cart
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const userId = req.body.userId || 'guest_user_123';

    const {
      fullName,
      email,
      phoneNumber,
      deliveryAddress,
      paymentMethod,
    } = req.body;

    if (!fullName || !email || !phoneNumber || !deliveryAddress || !paymentMethod) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Missing required order fields',
      });
    }

    const cart = await Cart.findOne({ userId }).populate('items.medicineId');

    if (!cart || cart.items.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    const orderItems = cart.items.map((item) => {
      return {
        medicineId: item.medicineId._id,
        name: item.medicineId.name,
        category: item.medicineId.category,
        price: item.medicineId.price,
        image: item.medicineId.image,
        quantity: item.quantity,
      };
    });

    const subtotal = orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const deliveryCharges = orderItems.length > 0 ? 150 : 0;
    const totalAmount = subtotal + deliveryCharges;

    const order = await Order.create({
      userId,
      items: orderItems,
      fullName,
      email,
      phoneNumber,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryCharges,
      totalAmount,
    });

    cart.items = [];
    await cart.save();

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not place order',
      error: error.message,
    });
  }
};

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.medicineId');

    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not fetch order',
      error: error.message,
    });
  }
};

export {
  createOrder,
  getOrderById,
};