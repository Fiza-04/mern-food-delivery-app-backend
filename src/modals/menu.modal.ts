import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  menuName: { type: String, required: true },
  menuActive: { type: Boolean, required: true, default: true },
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
