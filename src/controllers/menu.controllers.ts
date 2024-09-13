import { Request, Response } from "express";
import Menu from "../modals/menu.modal";
import mongoose from "mongoose";

export const getAllMenus = async (req: Request, res: Response) => {
  try {
    const menu = await Menu.find();
    res.status(200).json(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Fetching Menus: ${error}` });
  }
};

export const addMenu = async (req: Request, res: Response) => {
  try {
    const existingMenu = await Menu.findOne({
      restaurantId: req.userId,
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

export const updateMenu = async (req: Request, res: Response) => {};
export const deleteMenu = async (req: Request, res: Response) => {};
