import { Request, Response } from "express";
import User from "../modals/user.modal";

export const getCurrentUserData = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });

    if (!currentUser) {
      return res.status(404).json({ message: "User not Found!" });
    }

    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return res.status(200).send();
    }

    // create user if not registered
    const newUser = new User(req.body);
    await newUser.save();

    // return user object
    res.status(200).json({
      message: "User registered successfully",
      data: newUser.toObject(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering the user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, addressLine2, postcode, city, country } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.addressLine2 = addressLine2;
    user.postcode = postcode;
    user.city = city;
    user.country = country;

    await user.save();

    // return user object
    res.send(user);
    // .status(200)
    // .json({
    //   message: "User updated successfully",
    // })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating current user" });
  }
};
