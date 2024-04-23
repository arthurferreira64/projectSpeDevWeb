import express from "express";

const router = express.Router();

// Route pour afficher le formulaire d'inscription
router.get("/", (req, res) => {
    res.sendFile(__dirname + "/inscription-view.html");
});

// Route pour traiter les données du formulaire d'inscription
router.post("/inscription", (req, res) => {
    // Logique de traitement de l'inscription
});

export default router;
