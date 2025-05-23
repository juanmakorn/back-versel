import express from "express";
import { eventController } from "../controller/eventController.js";

const userRoute = express.Router();

userRoute.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

userRoute.get("/", async (req, res) => {
  try {
    const eventos = await Event.find();
    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default userRoute;