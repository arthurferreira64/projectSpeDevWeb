function getProductById(id) {
  return (
    fetch(`http://localhost:3000/product/${id}`)
      // Etape 1 : Je vais chercher les données
      .then((res) => res.json())
      // Etape 2 : Je ne récupère que ce qui m'intéresse
      .then((data) => data.product)
  );
}
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    const product = await getProductById(productId);
    console.log(product);
    if (product) {
      document.getElementById("name").value = product.name;
      document.getElementById("categorie").value = product.categorie;
      document.getElementById("description").value = product.description;
      document.getElementById("price").value = product.price;

      if (product.images.length > 0) {
        const imagesDiv = document.getElementById("images");

        // Parcourir le tableau d'images et créer les éléments <img>
        product.images.forEach((img) => {
          // Créer un élément <img>
          const imageElement = document.createElement("img");

          // Définir l'attribut src de l'image avec l'URL de l'image
          imageElement.src = `http://localhost:3000/image/${img.image}`;
          imageElement.width = 100;
          // Ajouter l'élément <img> à la div 'images'
          imagesDiv.appendChild(imageElement);
        });
      }
    }
  }
});

document
  .getElementById("addProductForm")
  .addEventListener("submit", function (event) {
    // Empêcher le comportement par défaut de soumission du formulaire
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);

    const files = document.getElementById("image").files;
    const name = document.getElementById("name").value;
    const categorie = document.getElementById("categorie").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const csrf = document.getElementById("csrf").value;
    const productId = urlParams.get("id");

    const formData = new FormData();

    // Ajouter les données du formulaire à l'objet FormData
    formData.append("name", name);
    formData.append("categorie", categorie);
    formData.append("price", price);
    formData.append("description", description);

    // Ajouter les fichiers sélectionnés à l'objet FormData
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }
    fetch(`http://localhost:3000/product/${productId}`, {
      method: "PATCH",
      headers: {
        CSRF: csrf,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.href = "../all-products/produits.html";
      })
      .catch((err) => {
        //Si echec
        alert("Erreur dans l'inscription, veuillez réessayer");
      });
  });
