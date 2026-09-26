const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { mobileNumber, password, confirmPassword, name } = req.body;

    // 1. Validation
    if (!mobileNumber || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mobile number, password, and confirm password'
      });
    }

    // Clean mobile number (strip non-digits)
    const cleanMobile = mobileNumber.toString().replace(/\D/g, '');

    if (cleanMobile.length < 10 || cleanMobile.length > 15) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid mobile number (10 to 15 digits)'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match'
      });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ mobileNumber: cleanMobile });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this mobile number is already registered'
      });
    }

    // 3. Create user
    const displayName = name && name.trim() ? name.trim() : `User-${cleanMobile.slice(-4)}`;
    const user = await User.create({
      mobileNumber: cleanMobile,
      password,
      name: displayName
    });

    if (user) {
      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          mobileNumber: user.mobileNumber,
          name: user.name,
          createdAt: user.createdAt,
          token
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error during registration'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mobile number and password'
      });
    }

    const cleanMobile = mobileNumber.toString().replace(/\D/g, '');

    // Find user and explicitly select password
    const user = await User.findOne({ mobileNumber: cleanMobile }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid mobile number or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid mobile number or password'
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        mobileNumber: user.mobileNumber,
        name: user.name,
        createdAt: user.createdAt,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        mobileNumber: user.mobileNumber,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error getting user profile'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
