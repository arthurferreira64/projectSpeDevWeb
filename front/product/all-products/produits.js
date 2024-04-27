let isLog = false;

function userIsLogged(callback) {
  // On récupère un csrf
  return fetch("http://localhost:3000/csrf-token")
    .then((res) => res.json())
    .then((data) => {
      // On vérifie si le user est connecté
      return fetch("http://localhost:3000/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          CSRF: data.csrfToken,
        },
        body: JSON.stringify({
          jeton: getCookie("token") ?? "fdsfds",
        }),
      });
    })
    .then((res) => {
      // Si pas connecté, renvoie false, sinon true
      if (res.status === 400) {
        return false; // Appel de la fonction de rappel avec false
      } else {
        return true; // Appel de la fonction de rappel avec true
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return false; // En cas d'erreur, appeler la fonction de rappel avec false
    });
}

function getProducts() {
  return fetch("http://localhost:3000/product")
    .then((res) => res.json())
    .then((data) => data.products)
    .then((products) =>
      products.map((el) => ({
        id: el.id,
        titre: el.name,
        description: el.description,
        prix: el.price,
        categorie: el.categorie,
      }))
    );
}

function appendToDomProducts(promise) {
  return promise.then((products) => {
    userIsLogged().then((isLoggedIn) => {
      const productsHTML = products
        .map(
          ({ id, titre, description, prix, categorie }) => `
                        <tr data-product-id="${id}" class="bg-white border-b">
                            <td class="px-6 py-4">${titre}</td>
                            <td class="px-6 py-4 max-w-xl">${description}</td>
                            <td class="px-6 py-4">${prix}</td>
                            <td class="px-6 py-4">${categorie}</td>
                            <td>
                            <button class="open-product px-4" data-product-id="${id}"><i class="fas fa-eye"></i></button>
                            ${
                              isLog
                                ? '<button class="btnEdit px-4" data-product-id="' +
                                  id +
                                  '"><i class="fa-solid fa-pen"></i></button>'
                                : ""
                            }
                            <button class="addToCart px-4" data-product-id="${id}" data-titre="${titre}" data-description="${description}" data-prix="${prix}" data-categorie="${categorie}"><i class="fas fa-cart-plus"></i></button>
                            ${
                              isLog
                                ? '<button class="deleteProduct ml-2" data-product-id="' +
                                  id +
                                  '"><i class="fas fa-trash-alt text-red-500"></i></button>'
                                : ""
                            }
                        </td>
                        </tr>
                    `
        )
        .join("");

      document.querySelector(
        "#users"
      ).innerHTML = `<div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left rtl:text-right">
          <thead class="text-xs uppercase bg-gray-50">
              <tr>
                            <th scope="col" class="px-6 py-3">Nom</th>
                            <th scope="col" class="px-6 py-3">Description</th>
                            <th scope="col" class="px-6 py-3">Prix</th>
                            <th scope="col" class="px-6 py-3">Catégorie</th>
                            <th scope="col" class="px-6 py-3">Action</th>
                        </tr>
                        <tbody>
                        ${productsHTML}
                        </tbody>
                        </table>
                    </div>
`;

      // Ajoutez des écouteurs d'événements aux boutons
      document.querySelectorAll(".open-product").forEach((button) => {
        button.addEventListener("click", function () {
          openProduct(this.getAttribute("data-product-id"));
        });
      });

      document.querySelectorAll(".btnEdit").forEach((button) => {
        button.addEventListener("click", function () {
          editProduct(this.getAttribute("data-product-id"));
        });
      });

      document.querySelectorAll(".addToCart").forEach((button) => {
        button.addEventListener("click", function () {
          addToCart(
            this.getAttribute("data-product-id"),
            this.getAttribute("data-titre"),
            this.getAttribute("data-description"),
            this.getAttribute("data-prix"),
            this.getAttribute("data-categorie")
          );
        });
      });

      document.querySelectorAll(".deleteProduct").forEach((button) => {
        button.addEventListener("click", function () {
          deleteProduct(this.getAttribute("data-product-id"));
        });
      });
    });
  });
}

// Supprimez les appels directes à userIsLogged et appendToDomProducts ici

// Mettez à jour le code pour déclencher l'appel initial à userIsLogged et appendToDomProducts une fois que le statut de connexion est obtenu
userIsLogged().then((isLoggedIn) => {
  isLog = isLoggedIn;
  appendToDomProducts(getProducts());
});

function filterProducts(promise) {
  return promise.then((personnes) =>
    personnes.filter(
      (personne) =>
        personne.titre.indexOf(document.querySelector("#search").value) !== -1
    )
  );
}

function openProduct(id) {
  window.location.href = `../one-product/one-product.html?id=${id}`;
}
function editProduct(id) {
  window.location.href = `../update-product/update-product.html?id=${id}`;
}

function deleteProduct(id) {
  if (isLog) {
    const csrf = document.getElementById("csrf").value;
    return fetch(`http://localhost:3000/product/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        CSRF: csrf,
      },
    })
      .then((response) => response.json())
      .then(() => {
        appendToDomProducts(getProducts());
      })
      .catch((error) =>
        console.error("Erreur lors de la suppression du produit :", error)
      );
  }
}

function addToCart(id, titre, description, prix, categorie) {
  const product = {
    id: id,
    titre: titre,
    description: description,
    prix: prix,
    qty: 1,
    categorie: categorie,
  };
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].qty += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}
userIsLogged().then((isLoggedIn) => {
  isLog = isLoggedIn; // Cela devrait afficher true ou false
});

appendToDomProducts(getProducts());

document
  .querySelector("#search")
  .addEventListener("keyup", () =>
    appendToDomProducts(filterProducts(getProducts()))
  );
