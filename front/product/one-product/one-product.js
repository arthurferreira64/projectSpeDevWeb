function getProductById(id) {
  return fetch(`http://localhost:3000/product/${id}`)
    .then((res) => res.json())
    .then((data) => data.product);
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    const productDetailsElement = document.getElementById("productDetails");
    const product = await getProductById(productId);

    if (product) {
      const images = product.images.map(
        (imageUrl) =>
          `<img width="250" class="m-2" src="http://localhost:3000/image/${imageUrl.image}" alt="${product.name}"></img>`
      );

      // Créez des paires d'images dans des divs conteneurs
      const imgPairs = [];
      for (let i = 0; i < images.length; i += 2) {
        const pair = images.slice(i, i + 2).join("");
        imgPairs.push(`<div class="flex">${pair}</div>`);
      }

      const imgHTML = imgPairs.join("");
      document.querySelector("#details").innerHTML = `
                <div class="container mx-auto mt-10 shadow-lg pb-2 w-1/2">
                     <h1 class="text-2xl font-bold mb-4 text-center">
                        Information de ${product.name}
                    </h1>
                <div class="max-w-lg mx-auto my-10">
                    <div class="mb-4">
                        <label for="name" class="block font-bold mb-2">
                            Nom : ${product.name}
                        </label>
                    </div>
                    <div class="mb-4">
                        <label for="name" class="block font-bold mb-2">
                            Catégorie : ${product.categorie}
                        </label>
                    </div>
                    <div class="mb-4">
                        <label for="name" class="block font-bold mb-2">
                            Description : ${product.description}
                        </label>
                    </div>
                    <div class="mb-4">
                     <label for="name" class="block font-bold mb-2"
                     >Prix : ${product.price} €</label>
                    </div>
                     <label for="name" class="block font-bold mb-2"
                     >Images :</label>
                    ${imgHTML}
                </div>
`;
    } else {
      productDetailsElement.innerHTML = "<p>Le produit n`existe pas!</p>";
    }
  }
});
