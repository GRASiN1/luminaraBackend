const { Schema, model } = require("mongoose");
const { genSalt, hash, compare } = require("bcryptjs");

const userSchema = new Schema(
  {
    fullName: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      type: String,
      default: "NORMAL",
    },
    iamge: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwiEvMsIQdXKlPNaO8F6X0wiLL4EwTpsxftQ&s",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("orders", {
  ref: "orders",
  localField: "_id",
  foreignField: "orderedBy",
});

// Virtual field for cart
userSchema.virtual("cart", {
  ref: "cart",
  localField: "_id",
  foreignField: "cartOf",
  justOne: true, // Since typically, a user has only one cart
});

// Virtual field for wishlist
userSchema.virtual("wishlist", {
  ref: "wishlists",
  localField: "_id",
  foreignField: "wishlistOf",
  justOne: true, // Assuming one wishlist per user
});

// Virtual field for addresses
userSchema.virtual("addresses", {
  ref: "address",
  localField: "_id",
  foreignField: "addressOf",
});

// Enable virtuals in JSON output
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await genSalt(5);
  const hashedPassword = await hash(this.password, salt);

  this.password = hashedPassword;
});

const User = model("users", userSchema);

module.exports = User;
