import { db } from "../../index.js";

export async function insertProduct(productData) {
  const { name, description, price, categorie } = productData;

  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO products (name, description, price, categorie) VALUES (?, ?, ?, ?)",
      [name, description, price, categorie],
      function (err) {
        if (err) {
          reject(new Error("Error insert product" + err));
        } else {
          const productId = this.lastID;
          resolve(productId);
        }
      }
    );
  });
}

export async function updateProductService(productId, updatedProductData) {
  const { name, description, price, categorie } = updatedProductData;

  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE products SET name = ?, description = ?, price = ?, categorie = ? WHERE id = ?",
      [name, description, price, categorie, productId],
      function (err) {
        if (err) {
          reject(new Error("Error updating product" + err));
        } else {
          resolve();
        }
      }
    );
  });
}

export async function deleteProductService(productId) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM products WHERE id = ?", [productId], function (err) {
      if (err) {
        reject(new Error("Error deleting product" + err));
      } else {
        resolve();
      }
    });
  });
}

export async function insertImage(image, productId) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO images (image, productId) VALUES (?, ?)",
      [image, productId],
      function (err) {
        if (err) {
          reject(new Error("Error insert image" + err));
        } else {
          const imageId = this.lastID;
          resolve(imageId);
        }
      }
    );
  });
}

export async function deleteImages(productId) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM images WHERE productId = ?",
      [productId],
      function (err) {
        if (err) {
          reject(new Error("Error deleting images" + err));
        } else {
          resolve();
        }
      }
    );
  });
}

export async function getAllProductsService() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM products", (err, rows) => {
      if (err) {
        reject(new Error("Error fetching all products: " + err));
      } else {
        resolve(rows);
      }
    });
  });
}

export async function getProductByIdService(productId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM products WHERE id = ?", [productId], (err, row) => {
      if (err) {
        reject(new Error("Error fetching product by id: " + err));
      } else {
        resolve(row);
      }
    });
  });
}

export async function getProductImage(productId) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM images WHERE productId = ?",
      [productId],
      (err, rows) => {
        if (err) {
          reject(new Error("Error fetching product by id: " + err));
        } else {
          resolve(rows);
        }
      }
    );
  });
}

export async function getProductCountByCategoryService() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT categorie AS name, COUNT(*) AS number FROM products GROUP BY categorie",
      (err, rows) => {
        if (err) {
          reject(
            new Error("Error fetching product counts by category: " + err)
          );
        } else {
          resolve(rows);
        }
      }
    );
  });
}
