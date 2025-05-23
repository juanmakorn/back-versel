// src/routes/presentationRoute.js
import express from "express";
import multer from 'multer'
import { PresentationController } from "../controller/presentationController.js";
import { authenticateToken } from "../middleware/auth.js";

const storage = multer.memoryStorage(); // usamos memoria temporal
const upload = multer({ storage });


const presentationRoute = express.Router();

// Rutas públicas
presentationRoute.get("/", PresentationController.getPresentations);
presentationRoute.get("/:id", PresentationController.getPresentation);
 // Rutas que requieren autenticación
 presentationRoute.use("/download/:id", authenticateToken);
presentationRoute.get("/download/:id", PresentationController.downloadPresentation);
presentationRoute.post("/presentations", authenticateToken, upload.single("file"), PresentationController.createPresentation);


export default presentationRoute;