const CustomError = require("../Service/errors");
const validator = require("email-validator");
const moment = require("moment");
const bcrypt = require("bcrypt");

const user = {
  nombre: "string",
  apellido: "string",
  correo: "string",
  clave: "string",
  rol: "number",
  sexo: "string",
  pais: "number",
  ids: "number",
};

// Regex para la validación de la contraseña
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{};:,<.>])[\S]{8,20}$/;

const validatePassword = (password) => {
  if (!password || !passwordRegex.test(password)) {
    throw new Error(
      "Password must contain at least 8 characters and a maximum of 20 characters, including at least one uppercase letter (A-Z), one lowercase letter (a-z), one digit (0-9), and one special character."
    );
  }
};

const validateObj = (validate, data) => {
  const error = {};
  const fields = Object.keys(data);

  Object.keys(validate).forEach((ele) => {
    if (!fields.includes(ele) || !data[ele]) {
      if (!isNaN(data[ele])) {
        if (ele == "clave" && data["ids"] == undefined) {
          error[ele] = ["This field may not be blank."];
        } else if (data[ele]?.length === 0 || data[ele] == "") {
          error[ele] = ["This field may not be blank."];
        }
      }
    } else if (Array.isArray(validate[ele])) {
      if (data[ele]?.length === 0 || data[ele] == "") {
        error[ele] = ["This field may not be blank."];
      } else if (!validate[ele].includes(typeof data[ele])) {
        error[ele] = [`This field must be an ${validate[ele][0]} or null`];
      }
    } else {
      if (ele === "sexo" && !["M", "F"].includes(data[ele])) {
        error[ele] = [`This field must be 'M' or 'F' .`];
      }

      if (ele === "rol" && ![1, 2, 3].includes(data[ele])) {
        error[ele] = [`This field must be 1, 2, or 3`];
      }

      if (ele === "correo") {
        if (!validator.validate(data[ele])) {
          error[ele] = [`This field must be in email format.`];
        }
        if (data[ele].length > 60) {
          error[ele] = [`This field must be a maximum of 60 characters.`];
        }
      }

      if (ele === "clave" && !passwordRegex.test(data[ele])) {
        error[ele] = [
          "Password must contain at least 8 characters and a maximum of 20 characters, including at least one uppercase letter (A-Z), one lowercase letter (a-z), one digit (0-9), and one special character.",
        ];
      }

      if (["nombre", "apellido"].includes(ele) && data[ele].length > 40) {
        error[ele] = [`This field must be a maximum of 40 characters.`];
      }

      if (validate[ele] !== typeof data[ele]) {
        error[ele] = [`This field must be a ${validate[ele]}`];
      }
    }
  });
  return error;
};

const validateUser = (data) => {
  let is_superadmin = 0;
  let is_staff = 0;

  const error = validateObj(user, data);
  if (Object.keys(error).length >= 1) {
    throw new CustomError(error, 400);
  } else {
    switch (data.rol) {
      case 1:
        is_superadmin = 1;
        break;
      case 2:
        is_staff = 1;
        break;
      case 3:
        break;
    }
    if (data.clave != null) {
      data.clave = bcrypt.hashSync(data.clave, 10);
    }

    return data;
  }
};

module.exports = {
  validateUser,
  validatePassword,
};
