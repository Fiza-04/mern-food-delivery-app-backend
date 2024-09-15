import { Request, Response } from "express";
import MenuItem from "../modals/menuitem.modals";

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { itemName, itemDescription, itemPrice, extras, menuItemActive } =
      req.body;
    const newItem = new MenuItem({
      itemName,
      itemDescription,
      itemPrice: parseFloat(itemPrice),
      extras: JSON.parse(extras || "[]"),
      menuItemActive: menuItemActive === "true",
      menuItemImageFile: req.file ? req.file.path : null,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating menu item", error });
  }
};
