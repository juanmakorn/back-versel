import express from "express";
import { eventController } from "../controller/eventController.js";
import { authenticateToken } from "../middleware/auth.js";

const eventRoute = express.Router();

// Rutas públicas
eventRoute.get("/", eventController.getEventos);
eventRoute.get("/:id", eventController.getEventoById);

// Rutas protegidas
eventRoute.post("/", authenticateToken, eventController.postEventos);
eventRoute.put("/:id", authenticateToken, eventController.updateEvento);
eventRoute.delete("/:id", authenticateToken, eventController.deleteEvento);

export default eventRoute;