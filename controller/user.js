const User = require("../models/user");
const Cart = require("../models/cart");
const wishlist = require("../models/wishlist");
const { generateToken } = require("../services/authentication");

async function handleCreateUser(req, res) {
  const { fullName, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    fullName,
    email,
    password,
  });
  const populatedUser = await User.findById(user._id)
    .populate("orders")
    .populate("cart")
    .populate("wishlist")
    .populate("addresses");
  if (populatedUser) {
    res.status(201).json({
      _id: populatedUser._id,
      fullName: populatedUser.fullName,
      email: populatedUser.email,
      role: populatedUser.role,
      cart: populatedUser.cart,
      wishlist: populatedUser.wishlist,
      orders: populatedUser.orders,
      addresses: populatedUser.addresses,
      token: generateToken({
        fullName: populatedUser.fullName,
        email: populatedUser.email,
        _id: populatedUser._id,
        role: populatedUser.role,
      }),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  let user;
  if (req.headers.authorization?.split("Bearer ")[1]) {
    user = await User.findOne({ email: email })
      .populate("orders")
      .populate("cart")
      .populate("wishlist")
      .populate("addresses");
  } else {
    user = await User.findOne({ email: email });
  }
  if (user && (await user.matchPassword(password))) {
    return res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      cart: user.cart,
      wishlist: user.wishlist,
      orders: user.orders,
      addresses: user.addresses,
      token: generateToken({
        fullName: user.fullName,
        email: user.email,
        _id: user._id,
        role: user.role,
      }),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
}

async function handleGetProfile(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .populate("orders")
      .populate("cart")
      .populate("wishlist")
      .populate("addresses");
    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        cart: user.cart,
        wishlist: user.wishlist,
        orders: user.orders,
        addresses: user.addresses,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  handleCreateUser,
  handleGetProfile,
  handleUserLogin,
};
