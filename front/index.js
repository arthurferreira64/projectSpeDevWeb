//Fonction qui regarde si le user est connecté ou pas
console.log(window.location.pathname);
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
        .then((res) => res.json())
        // Etape 2 : Je ne récupère que ce qui m'intéresse
        .then((data) => {
          setCookie("token", data.token, 1); // "1" représente la durée en heure avant expiration

          window.location.href = "/dashboard";
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
        .then((res) => res.json())
        .then((data) => {
          console.log(data.token);
          setCookie("token", data.token, 1); // "1" représente la durée en heure avant expiration

          window.location.href = "/dashboard";
        })
        .catch((err) => {
          //Si echec
          alert("Erreur dans l'inscription, veuillez réessayer");
        });
    });
}

//Register -------

function setCookie(cookieName, cookieValue, expiryInHour) {
  const date = new Date();
  date.setTime(date.getTime() + expiryInHour * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
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
