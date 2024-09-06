import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemDescription: { type: String, required: true },
  itemPrice: { type: Number, required: true },
  menuItemImageFile: { type: String },
});

const restaurantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantName: { type: String, required: true },
  restaurantAddress: { type: String, required: true },
  restaurantPinCode: { type: String, required: true },
  restaurantCity: { type: String, required: true },
  restaurantCountry: { type: String, required: true },
  deliveryPrice: { type: Number, required: true },
  estimatedDeliveryTimeFrom: { type: Number, required: true },
  estimatedDeliveryTimeTo: { type: Number, required: true },
  cuisines: [{ type: String, required: true }],
  menuItems: [menuItemSchema],
  imageFile: { type: String, required: true },
  // add openingTime Closing time
  isAcceptingOrders: { type: Boolean, default: true, required: true },
  status: { type: Boolean, default: true, required: true },
  lastUpdated: { type: Date, required: true },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
