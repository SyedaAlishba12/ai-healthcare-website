import Cart from '../models/Cart.js';
import HTTP_STATUS from '../constants/httpStatus.js';

// 1. Get Cart Items for a user
const getCart = async (req, res) => {
  try {
    const userId = req.query.userId || "guest_user_123";
    
    // Find the cart and populate the details of the medicines
    const cart = await Cart.findOne({ userId }).populate('items.medicineId');

    if (!cart) {
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { items: [] }
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not retrieve cart items',
      error: error.message
    });
  }
};

// 2. Add item to Cart or update its quantity
const addToCart = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;
    const userId = req.body.userId || "guest_user_123";

    if (!medicineId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Medicine ID is required'
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a brand new cart if it doesn't exist yet
      cart = new Cart({
        userId,
        items: [{ medicineId, quantity: quantity || 1 }]
      });
    } else {
      // Check if the medicine is already in the cart
      const itemIndex = cart.items.findIndex(item => item.medicineId.toString() === medicineId);

      if (itemIndex > -1) {
        // If medicine exists, update its quantity
        cart.items[itemIndex].quantity += (quantity || 1);
      } else {
        // If medicine doesn't exist, push it as a new item
        cart.items.push({ medicineId, quantity: quantity || 1 });
      }
    }

    await cart.save();
    
    // Return populated cart so frontend gets instant updated details
    const populatedCart = await cart.populate('items.medicineId');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Item added to cart successfully',
      data: populatedCart
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not add item to cart',
      error: error.message
    });
  }
};

// 3. Remove an item completely from the Cart
const removeFromCart = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const userId = req.query.userId || "guest_user_123";

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Filter out the selected medicine
    cart.items = cart.items.filter(item => item.medicineId.toString() !== medicineId);
    
    await cart.save();
    const populatedCart = await cart.populate('items.medicineId');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: populatedCart
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not remove item from cart',
      error: error.message
    });
  }
};

export {
  getCart,
  addToCart,
  removeFromCart
};