import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import * as path from "node:path";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

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
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login','login.html'));
});

const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
