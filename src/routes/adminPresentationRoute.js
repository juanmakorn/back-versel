// src/routes/adminPresentationRoute.js
import express from "express";
import { PresentationController } from "../controller/presentationController.js";
import { handleUploadErrors } from "../middleware/Upload.js";
import { authenticateToken } from "../middleware/auth.js";

const adminPresentationRoute = express.Router();

// Middleware de autenticación para todas las rutas
adminPresentationRoute.use(authenticateToken);

// Rutas
adminPresentationRoute.post("/", handleUploadErrors, PresentationController.createPresentation);
adminPresentationRoute.get("/", PresentationController.getPresentations);
adminPresentationRoute.get("/:id", PresentationController.getPresentation);
adminPresentationRoute.put("/:id", PresentationController.updatePresentation);
adminPresentationRoute.delete("/:id", PresentationController.deletePresentation);

export default adminPresentationRoute;