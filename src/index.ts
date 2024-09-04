import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database"));

const app = express();
app.use(express.json());
app.use(cors());

// sanity check
app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health: OK!" });
});

app.use("/api/user", userRoutes);

app.listen(5000, () => {
  console.log("Server started on localhost:5000");
});
