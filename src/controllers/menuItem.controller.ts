import { Request, Response } from "express";
import MenuItem from "../modals/menuitem.modals";

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;

    if (!menuId) {
      return res.status(404).json({ message: "No Such Menu Found!" });
    }

    const existingMenuItem = await MenuItem.findOne({
      menuId: menuId,
      itemName: req.body.itemName,
    });

    if (existingMenuItem) {
      return res.status(409).json({ message: "This Menu Item already Exists" });
    }

    const newItem = new MenuItem({
      ...req.body,
      itemPrice: parseFloat(req.body.itemPrice),
      extras: JSON.parse(req.body.extras || "[]"),
      menuItemImageFile: req.file ? req.file.path : null,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating menu item", error });
  }
};
