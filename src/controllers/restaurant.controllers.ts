import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Restaurant from "../modals/restaurant.modals";
import mongoose from "mongoose";

interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

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
    const menuItems = await Promise.all(
      (req.body.menuItems || []).map(async (menuItem: any, index: number) => {
        const menuItemFile = files?.menuItemImageFile?.[index];

        let itemImageURL = "";

        if (menuItemFile) {
          const menuItemImageBase64 = Buffer.from(menuItemFile.buffer).toString(
            "base64"
          );
          const menuItemImageURI = `data:${menuItemFile.mimetype};base64,${menuItemImageBase64}`;
          const menuItemUploadResponse = await cloudinary.v2.uploader.upload(
            menuItemImageURI
          );
          console.log(
            `Cloudinary upload for menu item ${index}:`,
            menuItemUploadResponse
          );
          itemImageURL = menuItemUploadResponse.url;
        } else {
          console.warn(`No image file found for menu item at index ${index}`);
        }

        return {
          ...menuItem,
          menuItemImageFile: itemImageURL, // Set the uploaded URL or keep empty
        };
      })
    );

    // const imageUrl = await uploadImages(
    //   req.files as MulterFiles,
    //   req.body.menuItems
    // );

    // Create the restaurant with images set
    const restaurant = new Restaurant({
      ...req.body,
      imageFile: uploadResponse,
      menuItems: menuItems,
      user: new mongoose.Types.ObjectId(req.userId),
      lastUpdated: new Date(),
    });

    await restaurant.save();
    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Restaurant not created: ${error}` });
  }
};

export const updateRestaurantData = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, addressLine2, postcode, city, country } =
      req.body;

    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.restaurantAddress = req.body.restaurantAddress;
    restaurant.restaurantPinCode = req.body.restaurantPinCode;
    restaurant.restaurantCity = req.body.restaurantCity;
    restaurant.restaurantCountry = req.body.restaurantCountry;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.isAcceptingOrders = req.body.isAcceptingOrders;
    // restaurant.status = req.body.status;
    restaurant.lastUpdated = new Date();

    // if (req.file) {
    //   const imageUrl = await uploadImages(
    //     req.files as MulterFiles,
    //     req.body.menuItems
    //   );
    //   restaurant.imageFile = imageUrl.restaurantImageURL;
    //   restaurant.menuItems = imageUrl.updatedMenuItems as any;
    // }
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
    const menuItems = await Promise.all(
      (req.body.menuItems || []).map(async (menuItem: any, index: number) => {
        const menuItemFile = files?.menuItemImageFile?.[index];

        let itemImageURL = "";

        if (menuItemFile) {
          const menuItemImageBase64 = Buffer.from(menuItemFile.buffer).toString(
            "base64"
          );
          const menuItemImageURI = `data:${menuItemFile.mimetype};base64,${menuItemImageBase64}`;
          const menuItemUploadResponse = await cloudinary.v2.uploader.upload(
            menuItemImageURI
          );
          console.log(
            `Cloudinary upload for menu item ${index}:`,
            menuItemUploadResponse
          );
          itemImageURL = menuItemUploadResponse.url;
        } else {
          console.warn(`No image file found for menu item at index ${index}`);
        }

        return {
          ...menuItem,
          menuItemImageFile: itemImageURL, // Set the uploaded URL or keep empty
        };
      })
    );

    // const imageUrl = await uploadImages(
    //   req.files as MulterFiles,
    //   req.body.menuItems
    // );

    // Create the restaurant with images set
    const updatedRestaurant = new Restaurant({
      ...req.body,
      imageFile: uploadResponse,
      menuItems: menuItems,
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

// const uploadImages = async (files: MulterFiles, menuItems: any[]) => {
//   try {
//     // Handling main restaurant image upload
//     const restaurantImage = files?.imageFile?.[0];
//     let restaurantImageURL = "";

//     if (restaurantImage) {
//       const base64Image = Buffer.from(restaurantImage.buffer).toString(
//         "base64"
//       );
//       const dataURI = `data:${restaurantImage.mimetype};base64,${base64Image}`;
//       const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
//       restaurantImageURL = uploadResponse.url;
//     } else {
//       console.warn("No restaurant image file found");
//     }

//     // Handling menu item image uploads
//     const updatedMenuItems = await Promise.all(
//       (menuItems || []).map(async (menuItem: any, index: number) => {
//         const menuItemFile = files?.menuItemImageFile?.[index];
//         let itemImageURL = "";

//         if (menuItemFile) {
//           const menuItemImageBase64 = Buffer.from(menuItemFile.buffer).toString(
//             "base64"
//           );
//           const menuItemImageURI = `data:${menuItemFile.mimetype};base64,${menuItemImageBase64}`;
//           const menuItemUploadResponse = await cloudinary.v2.uploader.upload(
//             menuItemImageURI
//           );
//           itemImageURL = menuItemUploadResponse.url;
//         } else {
//           console.warn(`No image file found for menu item at index ${index}`);
//         }

//         return {
//           ...menuItem,
//           menuItemImageFile: itemImageURL,
//         };
//       })
//     );

//     return {
//       restaurantImageURL,
//       updatedMenuItems,
//     };
//   } catch (error) {
//     console.error("Error uploading images:", error);
//     throw new Error(`Image upload failed: ${error}`);
//   }
// };
