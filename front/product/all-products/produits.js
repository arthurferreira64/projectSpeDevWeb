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
                    titre: el.libelle,
                    description: el.description,
                    prix: el.prix,
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
                        ({titre, description, prix, categorie}) => `
                        <tr>
                            <td style="text-align: center">${titre}</td>
                            <td style="text-align: center">${description}</td>
                            <td style="text-align: center">${prix}</td>
                            <td style="text-align: center">${categorie}</td>
                        </tr>
                    `
                    ).join("");

                document.querySelector("#users").innerHTML = `<div class="card">
                    <table class="table-bordered" style="width: 100%">
                        <tr>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Prix</th>
                            <th>Catégorie</th>
                        </tr>
                        ${productsHTML}
                        </table>
                    </div>
`;
                }
            )
            // Etape 6 : On intègre les nouvelles personnes au DOM
            .then((personnes) =>
                personnes.map((personne) => {
                    document.querySelector("#users").innerHTML += personne;
                })
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
