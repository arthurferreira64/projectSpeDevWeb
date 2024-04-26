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
                        <tr data-product-id="${id}">
                            <td style="text-align: center">${titre}</td>
                            <td style="text-align: center; max-width: 300px">${description}</td>
                            <td style="text-align: center">${prix}</td>
                            <td style="text-align: center">${categorie}</td>
                            <td>
                            <button onclick="openProduct(${id})"><i class="fas fa-eye"></i></button>
                            ${
                              isLog
                                ? '<button onclick="editProduct(' +
                                  id +
                                  ')" class="btnEdit"><i class="fa-solid fa-pen"></i></button>'
                                : ""
                            }
                            <button style="margin-left: 5px" onclick="addToCart(${id}, '${titre}', '${description}', ${prix}, '${categorie}')"><i class="fas fa-cart-plus"></i></button>
                            ${
                              isLog
                                ? '<button style="margin-left: 5px" onclick="deleteProduct(' +
                                  id +
                                  ')" id="btnDelete"><i class="fas fa-trash-alt" style="color: red;"></i></button>'
                                : ""
                            }
                        </td>
                        </tr>
                    `
        )
        .join("");

      document.querySelector("#users").innerHTML = `<div class="card">
                    <table class="table-bordered" style="width: 100%">
                        <tr>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Prix</th>
                            <th>Catégorie</th>
                            <th>Action</th>
                        </tr>
                        ${productsHTML}
                        </table>
                    </div>
`;
    });
  });
  // });
}

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
