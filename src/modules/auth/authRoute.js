import express from "express";
import {
  loginUserController,
  registerUserController,
  userIsLoggedController,
  logoutController,
  getUser,
  updateUser,
} from "./authController.js";

//On initialise
const authRoute = express.Router();

//Inscription
authRoute.post("/register", registerUserController);

//Connexion
authRoute.post("/login", loginUserController);

//Verifie si le user est connecté
authRoute.post("/verify", userIsLoggedController);

//Deconnexion
authRoute.get("/logout", logoutController);

//Information de l'utilisateur
authRoute.get("/getUser", getUser);

//Enregistrer l'utilisateur
authRoute.patch("/updateUser/:id", updateUser);

//Exportation des routes
export default authRoute;
