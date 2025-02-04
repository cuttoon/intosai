const userdb = require("../../Service/authService/Serviceaccount");
const userdbUser = require("../../Service/authService/Serviceusers");
const { secret } = require("../../Settings/Enviroment/config");
const bcrypt = require("bcrypt");
const { validateUser, validatePassword } = require("../../Models/users");
const { existEmail } = require("../common");
const jwt = require("jsonwebtoken");
const {
  TokenSignup,
  ExisToken,
  TokenDestroy,
} = require("../../Settings/Server/midlewar/TokenService");
const {
  forgotPass,
  resetPass,
  sendEmail,
} = require("../../Service/authService/NewPassword");
const CustomError = require("../../Service/errors");

module.exports = {
  Signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email == null && password == null) {
        return res.status(400).send({ statusCode: 400, message: "Incomplete data" });
      } else {
        let datavalidEmail = await userdb.getUserbyEmail(email);

        if (!datavalidEmail) {
          return res.status(404).send({ statusCode: 404, message: "Email not found" });
        }

        const passwordMatch = bcrypt.compareSync(password,datavalidEmail.CUSU_PASSWORD);
        if (!passwordMatch) {
          return res.status(401).send({ statusCode: 401, message: "Invalid password" });
        }

        const payload = {
          id: datavalidEmail.NUSU_ID,
          rol: datavalidEmail.NUSU_ROLID,
        };
        const token = TokenSignup(payload, secret, "30m");

        return res.status(200).send({
          IdCuenta: datavalidEmail.NUSU_ID,
          IdRol: datavalidEmail.NUSU_ROLID,
          Nombre: datavalidEmail.NOMBRE,
          Token: token,
        });
      }
    } catch (ex) {
      return res.status(500).send({ statusCode: 500, message: ex.message });
    }
  },
  Signup: async (req, res) => {
    try {
      const newUser = validateUser(req.body);

      if (await existEmail(req.body.correo)) {
        return res.status(400).send({ statusCode: 400, message: "Email already exists" });
      }

      let result = await userdbUser.createUser(newUser);

      const token = TokenSignup({ id: result }, secret, "30m");

      res.status(200).json({
        message:
          "User created successfully, please check your email to set your password.",
        token: token,
        email: req.body.correo,
      });
    } catch (ex) {
      return res.status(500).send({ message: ex.message });
    }
  },
  ResetPassword: async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;

      validatePassword(newPassword);

      let decodedToken;
        try {
            decodedToken = jwt.verify(token, secret);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(400).json({
                    message: "Your reset link has expired. Please request a new one."
                });
            }
            return res.status(400).json({ message: "Invalid token. Please try again." });
        }

        const userId = decodedToken.id;

      if (!ExisToken(userId)) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await resetPass(userId, hashedPassword);

      TokenDestroy(userId);

      res
        .status(200)
        .json({ message: "Password has been successfully reset." });
    } catch (error) {
      next(error);
    }
  },
  ForgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      const user = await userdb.getUserbyEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Email does not exist." });
      }

      const userId = user.NUSU_ID;
      if (!userId) {
        return res.status(404).json({ message: "User ID not found." });
      }

      const result = await forgotPass(email);
      if (result.error) {
        throw new Error(result.error);
      }

      const token = TokenSignup({ id: userId }, secret, "30m");

      res.status(200).json({
        message: "Please check your email to set your password.",
        token: token,
        email: email,
      });
    } catch (error) {
      console.error("Error in ForgotPassword controller:", error);
      next(error);
    }
  },

  SendEmail: async (req, res) => {
    try {
      const { email, subject, text, html } = req.body;
      if (!email || !subject || !html) {
        return res.status(400).send({ message: "All fields are required" });
      }

      const emailResult = await sendEmail(email, subject, text, html);
      if (emailResult.error) {
        return res.status(500).send({ message: emailResult.error });
      }

      res
        .status(200)
        .send({ message: "Email sent successfully", result: emailResult });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
