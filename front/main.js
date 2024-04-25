document.querySelector("#nav").innerHTML = `
<nav class="bg-white border-gray-200">
<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <div class="flex items-center space-x-3 rtl:space-x-reverse">
    <a href="/"
      class="self-center text-2xl font-semibold whitespace-nowrap"
    >
      Intégration externe
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
    <svg
      class="w-5 h-5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 17 14"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M1 1h15M1 7h15M1 13h15"
      />
    </svg>
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
            </Link>
          </li>
          
</>

        <a class="pointer" id="logout">
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

document.getElementById("logout").onclick = function () {
  deleteCookie("token");
  window.location.href = "/";
};

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
            document.querySelector("#login").classList.remove("hidden");

            if (window.location.pathname === "/dashboard") {
              window.location.href = "/login";
            }
            return;
          }

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