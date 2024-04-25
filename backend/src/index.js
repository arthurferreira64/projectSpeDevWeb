import express from "express";
import bodyParser from "body-parser";
import authRoute from "./modules/auth/authRoute.js";
import sqlite3 from "sqlite3";
import cors from "cors";
import cookieParser from "cookie-parser";
import csrf from "csrf";
import productRoute from "./modules/product/productRoute.js";

// Initialise le middleware CSRF avec des options
const tokens = new csrf();
const secret = tokens.secretSync();

// Utilise le middleware CSRF pour générer et stocker le jeton CSRF dans la session utilisateur

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Ajout du middleware CSRF ici

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "*",
    // methods: "GET,POST,PUT,DELETE,PATCH",
  })
);

app.use(function (req, res, next) {
  const { csrf } = req.headers;
  if (req.method !== "GET" && !tokens.verify(secret, csrf)) {
    return res.status(403).json({ error: "Jeton CSRF invalide !" });
  }
  next();
});

// Créez une instance de la base de données SQLite
export const db = new sqlite3.Database("user.db");

//Création de la table user si elle n'existe pas
db.serialize(() => {
  db.run(
    " CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT, fullname TEXT)"
  );
  db.run(
    " CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name varchar(500), description TEXT, price number, categorie TEXT)"
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
  const csrfToken = tokens.create(secret);
  // Renvoyer le jeton CSRF dans la réponse
  res.json({ csrfToken });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
