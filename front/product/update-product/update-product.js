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
    }
  }
});
