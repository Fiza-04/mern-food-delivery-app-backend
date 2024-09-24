import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Restaurant from "../modals/restaurant.modals";
import mongoose from "mongoose";

interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Fetching Restaurants: ${error}` });
  }
};

export const getRestaurantByID = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params._id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Fetching Restaurants: ${error}` });
  }
};

export const getRestaurantData = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Fetching Restaurant: ${error}` });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      return res.status(409).json({ message: "User already has a restaurant" });
    }

    // Handling image upload start
    const files = req.files as MulterFiles | undefined;
    const restaurantImage = files?.imageFile?.[0];

    if (!restaurantImage) {
    
      return res
        .status(400)
        .json({ message: "Restaurant image file is required" });
    }

    // Upload main restaurant image
    const base64Image = Buffer.from(restaurantImage.buffer).toString("base64");
    const dataURI = `data:${restaurantImage.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    // Create the restaurant with images set
    const restaurant = new Restaurant({
      ...req.body,
      imageFile: uploadResponse.url, // Store only the URL from the response
      user: new mongoose.Types.ObjectId(req.userId),
      lastUpdated: new Date(),
    });

    await restaurant.save();
    res.status(201).send(restaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: `Restaurant not created: ${error}` });
  }
};

export const updateRestaurantData = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    Object.assign(restaurant, req.body);
    restaurant.lastUpdated = new Date();

    const files = req.files as MulterFiles | undefined;
    const restaurantImage = files?.imageFile?.[0];

    if (!restaurantImage) {
      console.log(restaurantImage);
      return res
        .status(400)
        .json({ message: "Restaurant image file is required" });
    }

    // Upload main restaurant image
    const base64Image = Buffer.from(restaurantImage.buffer).toString("base64");
    const dataURI = `data:${restaurantImage.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    // Handling menu item image uploads
    // const menuItems = await Promise.all(
    //   (req.body.menuItems || []).map(async (menuItem: any, index: number) => {
    //     const menuItemFile = files?.menuItemImageFile?.[index];

    //     let itemImageURL = "";

    //     if (menuItemFile) {
    //       const menuItemImageBase64 = Buffer.from(menuItemFile.buffer).toString(
    //         "base64"
    //       );
    //       const menuItemImageURI = `data:${menuItemFile.mimetype};base64,${menuItemImageBase64}`;
    //       const menuItemUploadResponse = await cloudinary.v2.uploader.upload(
    //         menuItemImageURI
    //       );
    //       console.log(
    //         `Cloudinary upload for menu item ${index}:`,
    //         menuItemUploadResponse
    //       );
    //       itemImageURL = menuItemUploadResponse.url;
    //     } else {
    //       console.warn(`No image file found for menu item at index ${index}`);
    //     }

    //     return {
    //       ...menuItem,
    //       menuItemImageFile: itemImageURL, // Set the uploaded URL or keep empty
    //     };
    //   })
    // );

    // const imageUrl = await uploadImages(
    //   req.files as MulterFiles,
    //   req.body.menuItems
    // );

    // Create the restaurant with images set
    const updatedRestaurant = new Restaurant({
      ...req.body,
      imageFile: uploadResponse,
      // menuItems: menuItems,
      user: new mongoose.Types.ObjectId(req.userId),
      lastUpdated: new Date(),
    });

    await updatedRestaurant.save();
    res.status(200).send(updatedRestaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating restaurant" });
  }
};
