import express from "express";
import {
  createUser,
  getCurrentUserData,
  updateUser,
} from "../controllers/user.controller";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateUserRequest } from "../middleware/validation";

const router = express.Router();

// check auth, extract auth token, get current user's data
router.get("/", jwtCheck, jwtParse, getCurrentUserData);

// check auth, create new user
router.post("/", jwtCheck, createUser);

// check auth, extract auth token, validate access token, update user
router.put("/", jwtCheck, jwtParse, validateUserRequest, updateUser);

export default router;
