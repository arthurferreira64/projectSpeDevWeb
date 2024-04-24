//Fonction qui regarde si le user est connecté ou pas
function userIsLogged() {
  return (
    fetch("http://localhost:3000/verify")
      // Etape 1 : Je vais chercher les données
      .then((res) => res.json())
      // Etape 2 : Je ne récupère que ce qui m'intéresse
      .then((data) => (document.getElementById("csrf").value = data.csrfToken))
    // Etape 3 : ne récupérer que ce qui m'intéresse dans les personnes
    // et aussi changer les noms des propriétés
  );
}

//CSRF

function getCSRF() {
  return (
    fetch("http://localhost:3000/csrf-token")
      // Etape 1 : Je vais chercher les données
      .then((res) => res.json())
      // Etape 2 : Je ne récupère que ce qui m'intéresse
      .then((data) => (document.getElementById("csrf").value = data.csrfToken))
    // Etape 3 : ne récupérer que ce qui m'intéresse dans les personnes
    // et aussi changer les noms des propriétés
  );
}

//Produits ---------------------------------

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
      .then((products) =>
        products.map(
          ({ titre, description, prix, categorie }) =>
            `
<div class="card">
    <h2>${titre}</h2>
    <p>
        ${description}<br>
        ${prix} - ${categorie} ans
    </p>
</div>
`
        )
      )
      // Etape 5 : On vide la liste des personnes
      .then((personnes) => {
        document.querySelector("#users").innerHTML = "";
        return personnes;
      })
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
//Produits ---------------------------------

//Login -------
if (document.getElementById("loginForm")) {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      // Empêcher le comportement par défaut de soumission du formulaire
      event.preventDefault();

      const username = document.getElementById("usernameLogin").value;
      const password = document.getElementById("passwordLogin").value;
      const csrf = document.getElementById("csrf").value;

      console.log({
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-Token": csrf,
      });

      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          CSRF: csrf,
        },
        body: JSON.stringify({
          identifiant: username,
          motdepasse: password,
          // "X-CSRF-Token": csrf,
        }),
      })
        .then((res) => {
          window.location.href = "/dashboard";
          // Redirect to the dashboard upon successful login
        })
        .catch((err) => {
          //Si echec
          alert("Erreur dans la connexion, veuillez réessayer");
        });
    });
}
//Login -------

//Register -------
if (document.getElementById("registerForm")) {
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (event) {
      // Empêcher le comportement par défaut de soumission du formulaire
      event.preventDefault();

      const username = document.getElementById("usernameRegister").value;
      const password = document.getElementById("passwordRegister").value;
      const repeat = document.getElementById("repeatRegister").value;
      const fullname = document.getElementById("fullnameRegister").value;
      const csrf = document.getElementById("csrf").value;

      if (repeat !== password) {
        alert("les mots de passes doivent correspondre");
        return;
      }

      fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          CSRF: csrf,
        },
        body: JSON.stringify({
          identifiant: username,
          fullname: fullname,
          motdepasse: password,
        }),
      })
        .then((res) => {
          window.location.href = "/dashboard";
        })
        .catch((err) => {
          //Si echec
          alert("Erreur dans l'inscription, veuillez réessayer");
        });
    });
}

//Register -------
