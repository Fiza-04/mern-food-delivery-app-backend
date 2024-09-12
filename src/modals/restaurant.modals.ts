import mongoose from "mongoose";

// const menuItemSchema = new mongoose.Schema({
//   itemName: { type: String, required: true },
//   itemDescription: { type: String, required: true },
//   itemPrice: { type: Number, required: true },
//   menuItemImageFile: { type: String },
// });

const restaurantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurantName: { type: String, required: true },
    restaurantAddress: { type: String, required: true },
    restaurantPinCode: { type: String, required: true },
    restaurantCity: { type: String, required: true },
    restaurantCountry: { type: String, required: true },
    deliveryPrice: { type: Number, required: true },
    estimatedDeliveryTime: { type: Number, required: true },
    cuisines: [{ type: String, required: true }],
    // menuItems: [menuItemSchema],
    imageFile: { type: mongoose.Schema.Types.Mixed, required: true },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    isAcceptingOrders: { type: Boolean, default: true, required: true },
    status: { type: Boolean, default: true, required: true },
    lastUpdated: { type: Date, required: true },
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
