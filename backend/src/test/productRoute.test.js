import request from "supertest";
import app from "../index.js";

// const request = require("supertest");
// const app = require("../index.js");

describe("GET /product", () => {
  it("responds with JSON containing a list of products", async () => {
    const response = await request(app).get("/product");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("statut", "Succès");
    expect(response.body).toHaveProperty("products");
    // Tu peux ajouter d'autres assertions selon la structure de la réponse attendue
  });
});

describe("POST /create-product", () => {
  let csrfToken;

  // Avant chaque test, récupérer un jeton CSRF
  beforeAll(async () => {
    const csrfResponse = await request(app)
      .get("/csrf-token")
      .set("Accept", "application/json");

    csrfToken = csrfResponse.body.csrfToken;
  });

  it('responds with JSON containing a status "ok"', async () => {
    const productData = {
      product: {
        name: "Test Product",
        description: "This is a test product",
        price: 10.99,
        category: "Test Category",
      },
      images: ["test-image-1.jpg", "test-image-2.jpg"],
    };

    const response = await request(app)
      .post("/create-product")
      .send(productData)
      .set("Accept", "application/json")
      .set("csrf", csrfToken); // Ajoute le jeton CSRF à la requête

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("DELETE /product/:id", () => {
  let productId;
  let csrfToken;

  // Avant chaque test, créer un produit à supprimer et récupérer un jeton CSRF
  beforeAll(async () => {
    // Créer un produit fictif à supprimer
    const productData = {
      product: {
        name: "Product to Delete",
        description: "This is a product to delete",
        price: 19.99,
        category: "Test Category",
      },
      images: ["delete-image-1.jpg", "delete-image-2.jpg"],
    };

    // Récupérer un jeton CSRF
    const csrfResponse = await request(app)
      .get("/csrf-token")
      .set("Accept", "application/json");
    csrfToken = csrfResponse.body.csrfToken;

    // Créer le produit fictif
    const createProductResponse = await request(app)
      .post("/create-product")
      .send(productData)
      .set("Accept", "application/json")
      .set("csrf", csrfToken);
    productId = createProductResponse.body.productId;
  });

  it('responds with JSON containing a status "ok"', async () => {
    const response = await request(app)
      .delete(`/product/${productId}`)
      .set("Accept", "application/json")
      .set("csrf", csrfToken); // Ajoute le jeton CSRF à la requête

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("PATCH /product/:id", () => {
  let productId;
  let csrfToken;

  // Avant chaque test, créer un produit à mettre à jour et récupérer un jeton CSRF
  beforeAll(async () => {
    // Créer un produit fictif à mettre à jour
    const productData = {
      product: {
        name: "Product to Update",
        description: "This is a product to update",
        price: 29.99,
        category: "Test Category",
      },
      images: ["update-image-1.jpg", "update-image-2.jpg"],
    };

    // Récupérer un jeton CSRF
    const csrfResponse = await request(app)
      .get("/csrf-token")
      .set("Accept", "application/json");
    csrfToken = csrfResponse.body.csrfToken;

    // Créer le produit fictif
    const createProductResponse = await request(app)
      .post("/create-product")
      .send(productData)
      .set("Accept", "application/json")
      .set("csrf", csrfToken);
    productId = createProductResponse.body.productId;
  });

  it('responds with JSON containing a status "ok"', async () => {
    const updatedProductData = {
      product: {
        name: "Updated Product",
        description: "This is the updated product description",
        price: 39.99,
        category: "Updated Category",
      },
    };

    const response = await request(app)
      .patch(`/product/${productId}`)
      .send(updatedProductData)
      .set("Accept", "application/json")
      .set("csrf", csrfToken); // Ajoute le jeton CSRF à la requête

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
