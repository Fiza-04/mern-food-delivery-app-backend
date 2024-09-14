import express from "express";
import multer from "multer";
import {
  addMenu,
  deleteMenu,
  getAllMenus,
  updateMenu,
} from "../controllers/menu.controllers";

const router = express.Router();

// for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb size
  },
});

// const multiUpload = upload.fields([
//   { name: "imageFile", maxCount: 1 },
//   // { name: "menuItemImageFile", maxCount: 20 },
// ]);

router.get("/all", getAllMenus);

router.post("/add", addMenu);

router.put("/edit/:id", updateMenu);

router.delete("/delete/:id", deleteMenu);

export default router;
