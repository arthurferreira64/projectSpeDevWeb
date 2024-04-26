//Composant navbar qui s'insere dans une balise avec l'id 'nav'

document.querySelector("#nav").innerHTML = `
  <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          rel="stylesheet"
  />
<nav class="bg-white border-gray-200">
<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <div class="flex items-center space-x-3 rtl:space-x-reverse">
    <a href="/"
      class="self-center text-2xl font-semibold whitespace-nowrap"
    >
      Projet Dev
    </Link>
  </div>
  <button
    data-collapse-toggle="navbar-default"
    type="button"
    class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
    aria-controls="navbar-default"
    aria-expanded="false"
  >
    <span class="sr-only">Open main menu</span>
   
  </button>
  <div class="hidden w-full md:block md:w-auto" id="navbar-default">
    <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white md:items-center">
      <li>
        <a
          href="/"
          class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:text-gray-900"
          aria-current="page"
        >
          Accueil
        </a>
      </li>
          <li>
            <a
              href="/product/all-products/produits.html"
              class="block py-2 px-3 text-white rounded md:bg-transparent  md:p-0  md:text-gray-900"
              aria-current="page"
            >
              Produits
              </a>
          </li>
           <li>
            <a
              href="/product/statistic/statistic.html"
              id="statistic"
              class="block py-2 px-3 text-white rounded md:bg-transparent  md:p-0  md:text-gray-900"
              aria-current="page"
            >
              Statistique
              </a>
          </li>
           <li>
            <a
              href="/product/add-product/add-product.html"
              id="add-product"
              class="block py-2 px-3 text-white rounded md:bg-transparent  md:p-0  md:text-gray-900"
              aria-current="page"
            >
              Ajouter un produit
              </a>
          </li>
          <li>
            <a
              href="/cart/cart.html"
              id="cart"
              class="block py-2 px-3 text-white rounded md:bg-transparent  md:p-0  md:text-gray-900"
              aria-current="page"
            >
              <i class="fa fa-shopping-cart" style="margin-right: 5px"></i>Panier
              </a>
          </li>
          
</>

        <a class="cursor-pointer" id="logout">
          Se déconnecter
        </a>
        <a
        id="login"
          href="/login"
          class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
        >
          Se connecter
        </a>
    </ul>
  </div>
</div>
</nav>
`;

// Au clique sur la balise logout on supprime le cookie et on redirige le user
document.getElementById("logout").onclick = function () {
  deleteCookie("token");
  window.location.href = "/";
};

//Fonction qui supprime un cookie
function deleteCookie(nom) {
  document.cookie = nom + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function userIsLogged() {
  return (
    //On recupere un csrf
    fetch("http://localhost:3000/csrf-token")
      .then((res) => res.json())
      .then((data) => {
        //On verifie si le user est connecté
        fetch("http://localhost:3000/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            CSRF: data.csrfToken,
          },
          body: JSON.stringify({
            jeton: getCookie("token") ?? "fdsfds",
          }),
        }).then((res) => {
          //Si pas connecté redirection vers login si c'est pas le cas
          if (res.status === 400) {
            document.querySelector("#logout").classList.add("hidden");
            document.querySelector("#add-product").classList.add("hidden");
            document.querySelector("#login").classList.remove("hidden");

            if (window.location.pathname === "/dashboard") {
              window.location.href = "/login";
            }
            return;
          }
          document.querySelector("#add-product").classList.remove("hidden");
          document.querySelector("#logout").classList.remove("hidden");
          document.querySelector("#login").classList.add("hidden");
          //Si connecté impossible d'aller sur login
          if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/register"
          ) {
            window.location.href = "/dashboard";
          }
        });
      })
  );
}
function getCookie(name) {
  // Sépare les cookies individuels en utilisant ';'
  var cookies = document.cookie.split(";");

  // Parcourt chaque cookie
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    // Supprime les espaces en début et en fin de cookie
    cookie = cookie.trim();
    // Vérifie si le nom du cookie correspond à celui recherché
    if (cookie.indexOf(name + "=") === 0) {
      // Si c'est le cas, retourne sa valeur
      return cookie.substring(name.length + 1);
    }
  }
  // Si aucun cookie correspondant n'est trouvé, retourne null
  return null;
}

userIsLogged();

let metaTag = document.createElement("meta");

// Définir les attributs de la balise meta

const nonce = (Math.random() + 1).toString(36).substring(2);

metaTag.setAttribute("http-equiv", "Content-Security-Policy");
// metaTag.setAttribute(
//   "content",
//   `form-action 'self'; img-src 'none'; style-src https://cdnjs.cloudflare.com 'nonce-${nonce}' 'sha256-SOHhLX6uYgxUm6GqAfZoFtI6B+jag8IEw+xtCNel45E='; script-src https://cdnjs.cloudflare.com 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline'; object-src 'none'; base-uri 'self';`
// );

// Ajouter la balise meta au header du document
document.head.appendChild(metaTag);
