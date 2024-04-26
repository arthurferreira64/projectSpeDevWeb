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
                <div class="container mx-auto mt-10 shadow-lg" style="padding-bottom: 1rem; width: 50%">
                     <h1 class="text-2xl font-bold mb-4" style="text-align: center">
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
                  
                </div>
`;
            const imageGallery = document.getElementById('image');
            product.images.forEach(imageUrl => {
                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                imageElement.alt = product.name;
                imageGallery.appendChild(imageElement);
            });
        } else {
            productDetailsElement.innerHTML = '<p>Le produit n`existe pas!</p>';
        }
    }
});
