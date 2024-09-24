import { Request, Response } from "express";
import Menu from "../modals/menu.modal";
import mongoose from "mongoose";

export const getAllMenus = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res
        .status(400)
        .json({ message: "No such restaurant (Invalid restaurant ID)" });
    }

    const menu = await Menu.find({ restaurantId: restaurantId });
    res.status(200).json(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Fetching Menus: ${error}` });
  }
};

export const addMenu = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    // Check if the provided restaurantId is valid
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const existingMenu = await Menu.findOne({
      restaurantId: restaurantId,
      menuName: req.body.menuName,
    });

    if (existingMenu) {
      return res.status(409).json({ message: "This Menu already Exists" });
    }

    const menu = new Menu({
      ...req.body,
      restaurantId: new mongoose.Types.ObjectId(req.userId),
    });

    await menu.save();
    res.status(201).send(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Adding Menu: ${error}` });
  }
};

export const updateMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Menu Id" });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json(updatedMenu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Updating Menu: ${error}` });
  }
};

export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Menu Id" });
    }

    const deleteData = await Menu.findByIdAndDelete(id);

    if (!deleteData) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json({ message: "Data Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Deleting Menu: ${error}` });
  }
};
