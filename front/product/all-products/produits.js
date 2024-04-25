function getProducts() {
    return (
        fetch("http://localhost:3000/product")
            // Etape 1 : Je vais chercher les données
            .then((res) => res.json())
            // Etape 2 : Je ne récupère que ce qui m'intéresse
            .then((data) => data.products)
            // Etape 3 : ne récupérer que ce qui m'intéresse dans les personnes
            // et aussi changer les noms des propriétés
            .then((products) =>
                products.map((el) => ({
                    id: el.id,
                    titre: el.name,
                    description: el.description,
                    prix: el.price,
                    categorie: el.categorie,
                }))
            )
    );
}

function appendToDomProducts(promise) {
    // Etape 4 : Transformer les données en HTML
    return (
        promise
            .then((products) => {
                    const productsHTML = products.map(
                        ({id, titre, description, prix, categorie}) => `
                        <tr data-product-id="${id}">
                            <td style="text-align: center">${titre}</td>
                            <td style="text-align: center">${description}</td>
                            <td style="text-align: center">${prix}</td>
                            <td style="text-align: center">${categorie}</td>
                            <td>
                            <button onclick="openProduct(${id})"><i class="fas fa-eye"></i></button>
                            <button style="margin-left: 5px" onclick="addToCart(${id}, '${titre}', '${description}', ${prix}, '${categorie}')"><i class="fas fa-cart-plus"></i></button>
                            <button style="margin-left: 5px" onclick="deleteProduct(${id})"><i class="fas fa-trash-alt" style="color: red;"></i></button>
                        </td>
                        </tr>
                    `
                    ).join("");

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
                }
            )
    );
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
    console.log(id)
    window.location.href = `../one-product/one-product.html?id=${id}`;
}

function deleteProduct(id) {
    const csrf = document.getElementById("csrf").value;
    return fetch(`http://localhost:3000/product/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            CSRF: csrf,
        },
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Erreur lors de la suppression du produit :', error));
}

function addToCart(id, titre, description, prix, categorie) {
    const product = {
        id: id,
        titre: titre,
        description: description,
        prix: prix,
        qty: 1,
        categorie: categorie,
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cart);

    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].qty += 1;
        console.log(`La quantité du produit avec l'ID ${product.id} a été augmentée à ${cart[existingProductIndex].qty}.`);
    } else {
        cart.push(product);
        console.log(`Le produit avec l'ID ${product.id} a été ajouté au panier.`);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}
