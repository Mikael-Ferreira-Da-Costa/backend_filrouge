import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import pool from "../repositories/maria.db.pool.js";

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE name = ? OR email = ?",
      [name, email]
    );

    if (rows.length > 0) {
      return res.status(409).json({ message: "Nom déjà pris" });
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      name,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Nom déjà pris" });
    }
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Nom et mot de passe requis" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE name = ?", [
      name,
    ]);
    const user = rows[0];

    if (!user || !(await argon2.verify(user.password, password))) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const token = jwt.sign({ name: user.name }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(Date.now() + 3600000),
    });

    res.json({ user: name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

// PROFILE
export const profile = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Pas de token, accès refusé" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: "Profil utilisateur", name: decoded.name });
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(0),
  });
  res.json({ message: "Déconnexion réussie" });
};
