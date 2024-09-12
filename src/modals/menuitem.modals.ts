import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
    itemName: { type: String, required: true },
    itemDescription: { type: String, required: true },
    itemPrice: { type: Number, required: true },
    extras: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    menuItemImageFile: { type: String },
    menuItemActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
