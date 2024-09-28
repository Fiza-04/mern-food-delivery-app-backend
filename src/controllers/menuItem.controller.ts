import { Request, Response } from "express";
import MenuItem from "../modals/menuitem.modals";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

export const getMenuItemData = async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;
    console.log(menuId);
    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      console.log("here");
      return res.status(404).json({ message: "No Such Menu Found!" });
    }
    console.log("not in if statement");
    const data = await MenuItem.find({ menuId: menuId });
    console.log("data", data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu item", error });
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      return res.status(404).json({ message: "No Such Menu Found!" });
    }
    console.log("here");

    const existingMenuItem = await MenuItem.findOne({
      menuId: menuId,
      itemName: req.body.itemName,
    });

    console.log("existingMenuItem", existingMenuItem);

    if (existingMenuItem) {
      return res.status(409).json({ message: "This Menu Item already Exists" });
    }

    // handling image upload
    const files = req.files as MulterFiles | undefined;
    const menuItemImage = files?.menuItemImageFile?.[0];

    if (!menuItemImage) {
      return res.status(400).json({ message: "Image Field is required" });
    }

    // Upload main restaurant image
    const base64Image = Buffer.from(menuItemImage.buffer).toString("base64");
    const dataURI = `data:${menuItemImage.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    const newItem = new MenuItem({
      ...req.body,
      menuItemImageFile: uploadResponse.url,
      extras: JSON.parse(req.body.extras || "[]"),
    });

    console.log("newItem", newItem);

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating menu item", error });
  }
};
