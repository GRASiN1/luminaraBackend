const { Schema, model } = require("mongoose");

const wishlistSchema = new Schema(
  {
    wishlistOf: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    wishlistItems: [
      {
        product: {
          required: true,
          type: Schema.Types.ObjectId,
          ref: "products",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist = model("wishlists", wishlistSchema);

module.exports = Wishlist;
