import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProduct, getProductCountByCategory,
    updateProduct,
} from "./productController.js";

//On initialise
const productRoute = express.Router();

//Creer un produit
productRoute.post("/product", createProduct);

//Récupérer tous les produits
productRoute.get("/product", getAllProducts);

//Récupérer un produit
productRoute.get("/product/:id", getProduct);

//Récupérer statistique des catégories
productRoute.get("/product-stats", getProductCountByCategory);

//Modifier un produit
productRoute.patch("/product/:id", updateProduct);

//Supprimer un produit
productRoute.delete("/product/:id", deleteProduct);

//Exportation des routes
export default productRoute;
