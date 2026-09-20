import express from "express";
import {
  create,
  getCredential,
  login,
  updatePassword,
} from "../controllers/credentialsController.js";
//llama todas las funciones creadas en el controller de credential

const router = express.Router();

// ======================================================
// CREDENTIAL & AUTH ROUTES
// ======================================================

router.post("/login", login);

router.post("/users/:userId/credentials", create);

router.get("/users/:userId/credentials", getCredential);

router.put("/credentials/:id/password", updatePassword);

export default router;
