var express = require("express");
var router = express.Router();
var recaptchaHandler = require("./handlers/recaptcha.js");

router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.use("/recaptcha", recaptchaHandler);

module.exports = router;
