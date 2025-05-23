import User from "../schema/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import data from "../const/const.js";

export class AuthController {
  static async register(req, res) {
    try {
      const { username, password, email } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Hashear la contraseña
      const user = new User({ username, password: hashedPassword, email });
      await user.save();

      // No devolver la contraseña en la respuesta
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({ message: "Usuario registrado exitosamente", user: userResponse });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      // Generar tokens
      const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, data.secret, {
        expiresIn: data.tokenExpiry,
      });

      // Configurar cookies
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: data.environment === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
        token: token,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      // Limpiar cookies
      res.clearCookie("access_token");

      res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}