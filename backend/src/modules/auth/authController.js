import {
  getUserByEmail,
  loginUser,
  registerUser,
  saveUser,
} from "./authService.js";
import jwt from "jsonwebtoken";

const secretKey = "fds4gfqdsJ5KDLjlf7Jdion8oifd9iOfnJoin$$$28fdsfdKofkDpfkdj";

//Controller d'inscription
export async function registerUserController(req, res) {
  //On recupere les infos
  const { identifiant, fullname, motdepasse } = req.body;
  try {
    //On créé le user
    const message = await registerUser(identifiant, fullname, motdepasse);
    //On créé le token
    const token = jwt.sign(
      {
        loggedIn: true,
        email: identifiant,
      },
      secretKey,
      { expiresIn: "1h" }
    );

    console.log(token);
    res.cookie("token", token, { sameSite: "Lax" });
    //En cas de succès
    res.status(200).json({ statut: "Succès", message });
  } catch (error) {
    //En cas de mauvaise syntaxe du JSON de la requête
    res.status(400).json({ statut: "Erreur", message: "JSON incorrect" });
  }
}

//Controller de connexion
export async function loginUserController(req, res) {
  try {
    //On recupere les infos
    const { identifiant, motdepasse } = req.body;

    //On verifie les infos
    const result = await loginUser(identifiant, motdepasse);

    //Si ca reusssi on créé le token
    if (result.success) {
      const token = jwt.sign(
        {
          loggedIn: true,
          email: identifiant,
        },
        secretKey,
        { expiresIn: "1h" }
      );
      console.log(token);

      res.cookie("token", token, { sameSite: "Lax" });

      //En cas de succès
      res.status(200).json({
        statut: "Succès",
        message: "Authentication successful",
      });
    } else {
      //En cas de mauvais identifiants
      res
        .status(401)
        .json({ statut: "Erreur", message: "Identifiants incorrects" });
    }
  } catch (error) {
    //En cas de mauvaise syntaxe du JSON de la requête
    res.status(400).json({ statut: "Erreur", message: "JSON incorrect" });
  }
}

//Controller check si le user est connecté
export function userIsLoggedController(req, res) {
  // On récupère le token dans les cookies
  const token = req.body.jeton;

  try {
    // On vérifie si le token est dans la liste noire
    // const decoded = jwt.decode(token, secretKey);

    // On vérifie le token
    const isValid = jwt.verify(token, secretKey);

    if (isValid) {
      //En cas de succès
      res.status(200).json({
        statut: "Succès",
        message: "",
        utilisateur: {
          identifiant: "John",
        },
      });
    } else {
      //En cas de jeton incorrect
      res.status(401).json({ statut: "Erreur", message: "Jeton inconnu" });
    }
  } catch (error) {
    //En cas de mauvaise syntaxe du JSON de la requête
    res.status(400).json({ statut: "Erreur", message: "JSON incorrect" });
  }
}

//Controller deconnexion d'un user
export function logoutController(req, res) {
  // On supprime le token des cookies
  res.clearCookie("token");
  res.redirect("http://localhost:3000/#/login");
}

//Controller récuperer l'utilisateur grace à l'email
export async function getUser(req, res) {
  //On recupere les infos
  const email = req.query.email.email;
  try {
    //On créé le user
    const user = await getUserByEmail(email);
    //En cas de succès
    res.status(200).json({ statut: "Succès", user });
  } catch (error) {
    res.status(400).json({ statut: "Erreur" });
  }
}

export async function updateUser(req, res) {
  const id = req.params.id;
  const body = req.body;

  const userSave = await saveUser(id, body);

  try {
    //On créé le token
    const token = jwt.sign(
      {
        loggedIn: true,
        email: body.email,
      },
      secretKey,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { sameSite: "Lax" });
    res.status(200).json({ statut: "Succès", userSave });
  } catch (error) {
    res.status(400).json({ statut: "Erreur" });
  }
}
