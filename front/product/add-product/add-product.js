document
  .getElementById("addProductForm")
  .addEventListener("submit", function (event) {
    // Empêcher le comportement par défaut de soumission du formulaire
    event.preventDefault();

    const files = document.getElementById("image").files;
    const name = document.getElementById("name").value;
    const categorie = document.getElementById("categorie").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const csrf = document.getElementById("csrf").value;

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
    fetch("http://localhost:3000/create-product", {
      method: "POST",
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

getCSRF();
