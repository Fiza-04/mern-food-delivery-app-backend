import mongoose from "mongoose";
import MenuItem from "./menuitem.modals";

const menuSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  menuName: { type: String, required: true },
  menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: MenuItem }],
  menuActive: { type: Boolean, required: true, default: true },
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
