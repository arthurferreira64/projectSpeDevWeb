import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import * as path from "node:path";
import { log } from "console";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

let isLogged = false;

export function changeLoggedStatus(newValue) {
  isLogged = newValue;
}

app.use(
  cors({
    origin: "http://localhost:9000",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Définit le dossier des fichiers statiques (comme les fichiers HTML, CSS, etc.)
app.use(express.static(path.join(__dirname)));

// Route pour afficher la page d'accueil (home.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login", "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // "X-CSRF-Token": csrf,
    },
    credentials: "include",
    body: JSON.stringify({ identifiant: username, motdepasse: password }),
  })
    .then((res) => {
      console.log("ici");
      // if (response.ok) {
      //   // Redirect to the dashboard upon successful login
      //   res.status(response.status).send("Login succeed");
      // } else {
      //   // Handle other response statuses (e.g., authentication failure)
      //   res.status(response.status).send("Login failed");
      // }
    })
    .catch((err) => {
      //Si echec
      // res.status(500).send(err);
      console.log(err);
    });
});

app.post("/register", (req, res) => {
  const { fullname, repeat, username, password } = req.body;

  if (repeat !== password) {
    res.redirect("register");
  }

  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrf,
    },
    credentials: "include",
    body: {
      identifiant: username,
      fullname: fullname,
      motdepasse: password,
    },
  })
    .then((res) => {
      console.log("ici");
      console.log(res);
      // if (response.ok) {
      //   // Redirect to the dashboard upon successful login
      //   res.status(response.status).send("Login succeed");
      // } else {
      //   // Handle other response statuses (e.g., authentication failure)
      //   res.status(response.status).send("Login failed");
      // }
    })
    .catch((err) => {
      //Si echec
      // res.status(500).send(err);
      console.log(err);
    });
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register", "register.html"));
});

app.get("/dashboard", (req, res) => {
  if (isLogged) {
    res.sendFile(path.join(__dirname, "dashboard", "dashboard.html"));
  } else {
    res.redirect("/login");
  }
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
