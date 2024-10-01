import { Request, Response } from "express";
import MenuItem from "../modals/menuitem.modals";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import Menu from "../modals/menu.modal";

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

    await Menu.findByIdAndUpdate(menuId, {
      $push: { menuItems: newItem._id },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Error creating menu item", error });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const menuItemId = req.body._id;

    const itemData = await MenuItem.findOne({ _id: menuItemId });

    if (!itemData) {
      return res.status(404).json({ message: "MenuItem  not found" });
    }

    Object.assign(itemData, req.body);

    const menuItemImage = req.file;

    if (!menuItemImage) {
      console.log(menuItemImage);
      return res
        .status(400)
        .json({ message: "MenuItem image file is required" });
    }

    // Upload main restaurant image
    const base64Image = Buffer.from(menuItemImage.buffer).toString("base64");
    const dataURI = `data:${menuItemImage.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    itemData.menuItemImageFile = uploadResponse.secure_url;

    await MenuItem.findByIdAndUpdate(menuItemId, itemData, { new: true });

    res
      .status(200)
      .json({ message: "MenuItem updated successfully", item: itemData });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Error updating menu item", error });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { menuItemId, menuId } = req.body;

    console.log(
      "deleteMenuItem controller menuItemId => ",
      menuItemId,
      " menuId => ",
      menuId
    );

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
      return res.status(404).json({ message: "Menu Item not found" });
    }

    // Attempt to delete the menu item
    const deleteData = await MenuItem.findByIdAndDelete({ _id: menuItemId });
    console.log("Delete Data: ", deleteData); // Log what was returned

    // Check if delete was successful
    if (!deleteData) {
      return res.status(404).json({ message: "Menu Item not found" });
    }

    // Pull the deleted item from the associated menu
    const updateResult = await Menu.findByIdAndUpdate(menuId, {
      $pull: { menuItems: menuItemId },
    });

    console.log("Menu Update Result: ", updateResult); // Log the result of the update

    res.status(200).json({ message: "Menu Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item: ", error); // Log the error
    res.status(500).json({ message: "Error deleting menu: ", error });
  }
};
