import express from "express";
import { createMenuItem } from "../controllers/menuItem.controller";

const router = express.Router();

// check auth, extract auth token, get current user's data
// router.get("/all", getAllMenuItemData);
// router.get("/:id", getMenuItemData);

// check auth, create new user
router.post("/add/:menuId", createMenuItem);

// check auth, extract auth token, validate access token, update user
// router.put("/", updateMenuItem);

export default router;
