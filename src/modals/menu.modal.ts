import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  menuName: { type: String, required: true },
  menuCuisine: { type: String },
  menuActive: { type: Boolean, required: true, default: true },
});

const MenuItem = mongoose.model("MenuItem", menuSchema);

export default MenuItem;
