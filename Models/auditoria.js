const CustomError = require("../Service/errors");
//const validator = require("email-validator");
//const moment = require("moment");
//const bcrypt = require('bcrypt');

const auditoria = {
  titulo: "string",
  resumen: "string",
  objetivo: "string",
  tipo: "number",
  categoria: "number",
  fini: "string",
  ffin: "string",
  ids: "number",
  publicacion: "string",
  idioma: "number",
  url: "string",
  ambitoid: "number",
  paisid: "number",
  odsid: "number",
};

const validateObj = (validate, data) => {
  const error = {};
  // const fields = Object.keys(data);

  Object.keys(validate).forEach((ele) => {
    if (ele === "ids") {
      return;
    }

    if (!(ele in data) || data[ele] == null || data[ele] === "") {
      if (ele !== "url") {
        error[ele] = ["This field is required."];
      }
    } else {
      if (ele === "titulo" && data[ele].length > 255) {
        error[ele] = ["Max length is 255 characters."];
      }
      if (["resumen", "objetivo"].includes(ele) && data[ele].length > 4000) {
        error[ele] = ["Max length is 4000 characters."];
      }

      const regexURL = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/; 

      if (ele === "url" && data[ele] && !regexURL.test(data[ele])) {
        error[ele] = ["Invalid URL format."];
      }

      if (["fini", "ffin", "publicacion"].includes(ele)) {
        if (!/^\d{2}-\d{2}-\d{4}$/.test(data[ele])) {
          error[ele] = ["This field must be in format DD-MM-YYYY."];
        } else {
          const dateParts = data[ele].split("-");
          const parsedDate = new Date(
            `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
          );
          if (isNaN(parsedDate.getTime())) {
            error[ele] = [
              "This field must be a valid date in format DD-MM-YYYY.",
            ];
          }
        }
      }
    }
  });

  return error;
};

const validateAuditoria = (data) => {
  const error = validateObj(auditoria, data);

  if (Object.keys(error).length >= 1) {
    throw new CustomError(error, 400);
  } else {
    return data;
  }
};

module.exports = validateAuditoria;
