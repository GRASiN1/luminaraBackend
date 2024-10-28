const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    cartOf: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    cartItem: [
      {
        product: {
          required: true,
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          required: true,
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = model("cart", cartSchema);

module.exports = Cart;
