import express from "express";
import userRoute from "../routes/userRoute.js";
import adminRoute from "../routes/adminRoute.js";
import presentationRoute from "../routes/presentationRoute.js";
import adminPresentationRoute from "../routes/adminPresentationRoute.js";
import authRoute from "../routes/authRoute.js";
import data from "../const/const.js";

const router = express.Router();

// Verificar que data.secret esté definido
if (!data.secret) {
  console.error("Error: JWT secret is not defined in const.js");
  process.exit(1);
}

// Montar las rutas
router.use("/", userRoute);
router.use("/admin", adminRoute);
router.use("/presentations", presentationRoute);
router.use("/admin/presentations", adminPresentationRoute);
router.use("/auth", authRoute);

export default router;