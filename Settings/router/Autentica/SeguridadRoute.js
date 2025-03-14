const express = require("express");
const router = express.Router();
const { Security } = require("../../../Controllers");
const { Filter, Destroy } = require("../../Server/midlewar/permissions");
//registrar
router.post("/Signup", Security.Signup);
//loguear
router.post("/Signin", Security.Signin);
router.post("/Signoff", Destroy);

//olvidar contraseña
router.post("/ForgotPassword", Security.ForgotPassword);

// para restablecerlo
router.post("/ResetPassword", Security.ResetPassword);

router.post("/sendEmail", Security.SendEmail);

/* app.use(function(req,res){
  res.type("text/plain")
    res.status(500)
    res.send("Something went wrong, please try again later.")
}) */

module.exports = (app, nextMain) => {
  app.use("/intosai/security", router);
  return nextMain();
};
