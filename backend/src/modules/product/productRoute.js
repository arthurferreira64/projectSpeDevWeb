import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getProductCountByCategory,
  updateProduct,
} from "./productController.js";
import multer from "multer";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});
const upload = multer({ storage: storage });
//On initialise
const productRoute = express.Router();

//Creer un produit
productRoute.post("/create-product", upload.array("photos", 12), createProduct);

//Récupérer tous les produits
productRoute.get("/product", getAllProducts);

//Récupérer un produit
productRoute.get("/product/:id", getProduct);

//Récupérer statistique des catégories
productRoute.get("/product-stats", getProductCountByCategory);

//Modifier un produit
productRoute.patch("/product/:id", upload.array("photos", 12), updateProduct);

//Supprimer un produit
productRoute.delete("/product/:id", deleteProduct);

//Exportation des routes
export default productRoute;
