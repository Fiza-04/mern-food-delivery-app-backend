import express from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemData,
  updateMenuItem,
} from "../controllers/menuItem.controller";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// check auth, extract auth token, get current user's data
// router.get("/all", getAllMenuItemData);
router.get("/:menuId", getMenuItemData);

// check auth, create new user
router.post("/add/:menuId", upload.single("menuItemImageFile"), createMenuItem);

// check auth, extract auth token, validate access token, update user
router.put("/edit", upload.single("menuItemImageFile"), updateMenuItem);

router.delete("/delete", deleteMenuItem);

export default router;
