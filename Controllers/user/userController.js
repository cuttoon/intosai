const userdb = require("../../Service/authService/Serviceusers");
const { validateUser } = require("../../Models/users");
const CustomError = require("../../Service/errors");
const { existEmail, existEmailUpdate } = require("../common");
const { sendEmail } = require("../../Service/authService/NewPassword");

module.exports = {
  getAllUsers: async (req, resp, next) => {
    try {
      const users = await userdb.getAllUsers();
      resp.send({ result: users });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  createUser: async (req, resp, next) => {
    try {
      const newUser = validateUser(req.body);

      if (await existEmail(req.body.correo)) {
        throw new CustomError({ correo: ["email already exists"] }, 400);
      }

      let result = await userdb.createUser(newUser);
      resp.send({ result });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },

  updateUser: async (req, resp, next) => {
    try {
      console.log(req.body);
      const updateUser = validateUser(req.body);

      if (await existEmailUpdate(req.body.ids)) {
        throw new CustomError({ correo: ["email already exists"] }, 400);
      }

      let { userId } = await userdb.updateUser(updateUser);
      console.log('Usuario actualizado con ID:', userId);

      resp.send({ userId });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
};
