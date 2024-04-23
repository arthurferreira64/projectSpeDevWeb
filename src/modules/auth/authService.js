import bcrypt from "bcrypt";
import {db} from "../../index.js";

//Regarde si l'email en parametre existe en bdd
async function checkUserExists(email) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(!!row); // Renvoie true si l'e-mail est déjà utilisé, sinon false
            }
        });
    });
}

//Insert un user en bdd s'il n'existe pas
export async function registerUser(email, fullname, password) {
    const userExists = await checkUserExists(email);
    if (userExists) {
        throw new Error("Cet e-mail est déjà enregistré.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users (email, password, fullname) VALUES (?, ?, ?)",
            [email, hashedPassword, fullname],
            function (err) {
                if (err) {
                    reject(new Error("Error registering user" + err));
                } else {
                    resolve("User registered successfully");
                }
            }
        );
    });
}

//Verifie le user et password d'un user en parametre
export async function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
            if (err) {
                reject({success: false, error: "Error authenticating user"});
                return;
            }

            if (!row) {
                resolve({success: false, error: "Invalid email or password"});
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, row.password);

            if (isPasswordValid) {
                resolve({success: true});
                return;
            } else {
                resolve({success: false, error: "Invalid email or password"});
                return;
            }
        });
    });
}

// Récupère les informations de l'utilisateur par ID
export async function getUserByEmail(userEmail) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE email = ?", [userEmail], (err, row) => {
            if (err) {
                reject(new Error("Error fetching user information" + err));
            } else {
                if (row) {
                    const userInfo = {
                        id: row.id,
                        email: row.email,
                        fullname: row.fullname,
                    };
                    resolve(userInfo);
                } else {
                    reject(new Error("User not found"));
                }
            }
        });
    });
}

// Récupère les informations de l'utilisateur par ID
export async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
            if (err) {
                reject(new Error("Error fetching user information" + err));
            } else {
                if (row) {
                    const userInfo = {
                        id: row.id,
                        email: row.email,
                        fullname: row.fullname,
                    };
                    resolve(userInfo);
                } else {
                    reject(new Error("User not found"));
                }
            }
        });
    });
}

// Sauvegarder un utilisateur
export async function saveUser(id, body) {
    try {

        const updates = {email: body.email, fullname: body.fullname};

        if (body.password) {
            // Hasher le nouveau mot de passe et l'ajouter aux mises à jour
            updates.password = await bcrypt.hash(body.password, 10);
        }

        if (body.password) {
            return new Promise((resolve, reject) => {
                db.run(
                    "UPDATE users SET email = ?, fullname = ?, password = ? WHERE id = ?",
                    [updates.email, updates.fullname, updates.password, id],
                    function (err) {
                        if (err) {
                            reject(new Error("Erreur lors de la sauvegarde de l'utilisateur : " + err));
                        } else {
                            resolve("Utilisateur sauvegardé avec succès");
                        }
                    }
                );
            });
        } else {
            return new Promise((resolve, reject) => {
                db.run(
                    "UPDATE users SET email = ?, fullname = ? WHERE id = ?",
                    [updates.email, updates.fullname, id],
                    function (err) {
                        if (err) {
                            reject(new Error("Erreur lors de la sauvegarde de l'utilisateur : " + err));
                        } else {
                            resolve("Utilisateur sauvegardé avec succès");
                        }
                    }
                );
            });
        }

    } catch (error) {
        throw new Error("Erreur lors de la sauvegarde de l'utilisateur : " + error.message);
    }
}

