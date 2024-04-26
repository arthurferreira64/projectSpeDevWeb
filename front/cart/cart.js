// Fonction pour afficher les produits dans le panier
function afficherProduitsDansPanier(produits) {
  const panierContainer = document.getElementById("cart-container");

  if (produits.length === 0) {
    panierContainer.innerHTML = "<p>Le panier est vide.</p>";
    return;
  }

  const tableHTML = `
    <h1 class="text-center text-2xl"> Panier</h1>
        
            <tbody>
                ${produits
                  .map(
                    (produit) => `
                    <tr>
                        <td class="border border-gray-300 px-4 py-2 text-center">${produit.titre}</td>
                        <td class="border border-gray-300 px-4 py-2 text-center">${produit.categorie} </td>
                        <td class="border border-gray-300 px-4 py-2 text-center">${produit.prix} €</td>
                        <td class="border border-gray-300 px-4 py-2 text-center">${produit.qty}</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
  panierContainer.innerHTML = `
    <table class="border-collapse border border-gray-300 w-full">
            <thead>
                <tr>
                    <th class="border border-gray-300 px-4 py-2">Nom</th>
                    <th class="border border-gray-300 px-4 py-2">Prix</th>
                     <th class="border border-gray-300 px-4 py-2">Catégorie</th>
                    <th class="border border-gray-300 px-4 py-2">Quantité</th>
                </tr>
            </thead>
    ${tableHTML}
`;
}

const cart = JSON.parse(localStorage.getItem("cart"));
if (cart) {
  afficherProduitsDansPanier(cart);
} else {
  console.log("Le panier est vide.");
}
