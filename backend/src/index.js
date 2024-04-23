import express from "express";
import bodyParser from "body-parser";
import authRoute from "./modules/auth/authRoute.js";
import sqlite3 from "sqlite3";
import cors from "cors";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import productRoute from "./modules/product/productRoute.js";

// Initialise le middleware CSRF avec des options
const csrfProtection = csrf({ cookie: true });

// Utilise le middleware CSRF pour générer et stocker le jeton CSRF dans la session utilisateur

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(csrfProtection);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

// Créez une instance de la base de données SQLite
export const db = new sqlite3.Database("user.db");

//Création de la table user si elle n'existe pas
db.serialize(() => {
  db.run(
    " CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT, fullname TEXT)"
  );
  db.run(
    " CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, libelle varchar(500), description TEXT, Prix TEXT, Catégorie TEXT)"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY, image VARCHAR(500), productId INTEGER, FOREIGN KEY(productId) REFERENCES products(id))"
  );
});

//Appel des routes auth
app.use(authRoute);
//Appel des routes produits
app.use(productRoute);

app.get("/csrf-token", (req, res) => {
  // Générer un jeton CSRF
  const csrfToken = req.csrfToken();
  // Renvoyer le jeton CSRF dans la réponse
  res.json({ csrfToken });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
