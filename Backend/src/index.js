import "dotenv/config";
import express from "express";
import cors from "cors";

//rutas
import aiRoutes from "./routes/aiRoutes.js";
import roomRoutes from "./routes/roomRoutes.js"; //
import userRoutes from "./routes/userRoutes.js";
import objectRoutes from "./routes/objectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import credentialsRoutes from "./routes/credentialsRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// endpoints
app.use("/api", aiRoutes);
app.use("/api", roomRoutes);
app.use("/api", userRoutes);
app.use("/api", objectRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", credentialsRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El backend está escuchando en http://localhost:${PORT}`);
});
