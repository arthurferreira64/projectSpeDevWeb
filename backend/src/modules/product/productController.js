import {
  deleteImages,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  getProductCountByCategoryService,
  getProductImage,
  insertImage,
  insertProduct,
  updateProductService,
} from "./productService.js";

export async function createProduct(req, res) {
  const { name, description, price, categorie } = req.body;

  try {
    //On verifie le token
    // const decoded = jwt.verify(token, secretKey);
    // if (decoded) {
    //On créé le produit

    const images = req.files ? req.files.map((el) => el.filename) : null;

    // const uploadedFile = req.files.image0;

    // console.log(uploadedFile);
    const product = {
      name,
      description,
      price,
      categorie,
    };
    const productId = await insertProduct(product);

    console.log(productId);

    //On créé les images
    if (images) {
      console.log("icici");
      await Promise.all(
        images.map(async (image) => {
          await insertImage(image, productId);
        })
      );
    }

    res.status(200).json({ status: "ok" });
    // } else {
    //   res
    //     .status(403)
    //     .json({ message: "L'utilisateur n'est pas connecté", token: null });
    // }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function updateProduct(req, res) {
  const id = req.params.id;
  const { product } = req.body;

  const token = req.cookies.token;

  try {
    //On verifie le token
    // const decoded = jwt.verify(token, secretKey);
    // if (decoded) {
    //On met à jour le produit
    await updateProductService(id, product);

    res.status(200).json({ status: "ok" });
    // } else {
    //   res
    //     .status(403)
    //     .json({ message: "L'utilisateur n'est pas connecté", token: null });
    // }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteProduct(req, res) {
  const id = req.params.id;

  const token = req.cookies.token;

  try {
    //On verifie le token
    // const decoded = jwt.verify(token, secretKey);
    // if (decoded) {
    //On supprime les images associées au produit
    await deleteImages(id);
    //On supprime le produit
    await deleteProductService(id);

    res.status(200).json({ status: "ok" });
    // } else {
    //   res
    //     .status(403)
    //     .json({ message: "L'utilisateur n'est pas connecté", token: null });
    // }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getAllProducts(req, res) {
  try {
    const products = await getAllProductsService();

    res.status(200).json({ statut: "Succès", products });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getProduct(req, res) {
  const id = req.params.id;

  try {
    const product = await getProductByIdService(id);
    const images = await getProductImage(id);

    product.images = images;

    res.status(200).json({ statut: "Succès", product });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getProductCountByCategory(req, res) {
  try {
    const productCounts = await getProductCountByCategoryService();
    res.status(200).json({ status: "Success", productCounts });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
