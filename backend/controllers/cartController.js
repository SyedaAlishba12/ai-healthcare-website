import Cart from '../models/Cart.js';
import Medicine from '../models/Medicine.js';
import HTTP_STATUS from '../constants/httpStatus.js';

// 1. Get Cart Items for a user
const getCart = async (req, res) => {
  try {
    const userId = req.query.userId || "guest_user_123";

    const cart = await Cart.findOne({ userId }).populate('items.medicineId');

    if (!cart) {
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { userId, items: [] },
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not retrieve cart items',
      error: error.message,
    });
  }
};

// 2. Add item to Cart or increase quantity
const addToCart = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;
    const userId = req.body.userId || "guest_user_123";

    if (!medicineId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Medicine ID is required',
      });
    }

    const medicineExists = await Medicine.findById(medicineId);

    if (!medicineExists) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ medicineId, quantity: quantity || 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.medicineId.toString() === medicineId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ medicineId, quantity: quantity || 1 });
      }
    }

    await cart.save();

    const populatedCart = await cart.populate('items.medicineId');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Item added to cart successfully',
      data: populatedCart,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not add item to cart',
      error: error.message,
    });
  }
};

// 3. Update item quantity
const updateCartItem = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const { quantity } = req.body;
    const userId = req.body.userId || req.query.userId || "guest_user_123";

    if (!medicineId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Medicine ID is required',
      });
    }

    if (!quantity || Number(quantity) < 1) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.medicineId.toString() === medicineId
    );

    if (itemIndex === -1) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cart.items[itemIndex].quantity = Number(quantity);

    await cart.save();

    const populatedCart = await cart.populate('items.medicineId');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cart item updated successfully',
      data: populatedCart,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not update cart item',
      error: error.message,
    });
  }
};

// 4. Remove an item completely from the Cart
const removeFromCart = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const userId = req.query.userId || "guest_user_123";

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      item => item.medicineId.toString() !== medicineId
    );

    await cart.save();

    const populatedCart = await cart.populate('items.medicineId');

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: populatedCart,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not remove item from cart',
      error: error.message,
    });
  }
};

// 5. Clear full cart after order
const clearCart = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId || "guest_user_123";

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Cart already empty',
        data: { userId, items: [] },
      });
    }

    cart.items = [];
    await cart.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error: Could not clear cart',
      error: error.message,
    });
  }
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};