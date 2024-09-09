import express from "express";
import multer from "multer";
import {
  createRestaurant,
  getRestaurantData,
  updateRestaurantData,
} from "../controllers/restaurant.controllers";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateRestaurantRequest } from "../middleware/validation";

const router = express.Router();

// for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb size
  },
});

const multiUpload = upload.fields([
  { name: "imageFile", maxCount: 1 },
  { name: "menuItemImageFile", maxCount: 20 },
]);

router.get("/", jwtCheck, jwtParse, getRestaurantData);

router.post(
  "/",
  // validateRestaurantRequest,
  jwtCheck,
  jwtParse,
  multiUpload,
  createRestaurant
);

router.put("/", jwtCheck, jwtParse, multiUpload, updateRestaurantData);

// router.delete("/", deleteRestaurant);

export default router;
