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
    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      return res.status(404).json({ message: "No Such Menu Found!" });
    }
    const data = await MenuItem.find({ menuId: menuId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu item", error });
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;

    console.log("req.body", req.body);

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

    // Access the uploaded image
    const menuItemImage = req.file; // Change this line

    if (!menuItemImage) {
      console.log("Image field not present in the request");
      return res.status(400).json({ message: "Image field is required" });
    }

    // Upload the image to Cloudinary
    const base64Image = Buffer.from(menuItemImage.buffer).toString("base64");
    const dataURI = `data:${menuItemImage.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    console.log("Upload response:", uploadResponse);

    const newItem = new MenuItem({
      ...req.body,
      menuItemImageFile: uploadResponse.url, // Store the uploaded image URL
      extras: JSON.parse(req.body.extras || "[]"),
    });

    console.log("New Item:", newItem);

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating menu item:", error); // Log the error for debugging
    res.status(500).json({ message: "Error creating menu item", error });
  }
};
