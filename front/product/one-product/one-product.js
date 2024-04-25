function getProductById(id) {
    return (
        fetch(`http://localhost:3000/product/${id}`)
            // Etape 1 : Je vais chercher les données
            .then((res) => res.json())
            // Etape 2 : Je ne récupère que ce qui m'intéresse
            .then((data) => data.product)
    );
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        const productDetailsElement = document.getElementById('productDetails');
        const product = await getProductById(productId);
        if (product) {
            document.querySelector("#details").innerHTML = `
                    <h1 style="text-align: center"> Information de ${product.name} </h1>
                   <div class="bg-white p-4 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold">${product.name}</h3>
                    <p class="text-gray-600">${product.description}</p>
                    <p class="text-gray-800 font-bold mt-2">${product.price} €</p>
                </div>
            `;
        } else {
            productDetailsElement.innerHTML = '<p>Le produit n`existe pas!</p>';
        }
    }
});
