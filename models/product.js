const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const productSchema = new Schema(
  {
    productName: {
      required: true,
      type: String,
    },
    productDescription: {
      required: true,
      type: String,
    },
    productPrice: {
      required: true,
      type: String,
    },
    productImage: {
      required: true,
      type: String,
    },
    category: {
      required: true,
      type: String,
    },
    countInStock: {
      required: true,
      type: Number,
    },
    productId: {
      type: String,
      unique: true,
      sparse: true,
    },
    details: {
      material: { type: String },
      care: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (!this.productId) {
    this.productId = uuidv4();
  }
  next();
});

const Product = model("products", productSchema);

module.exports = Product;
