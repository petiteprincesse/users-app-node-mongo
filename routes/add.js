const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = Router();
const fs = require("fs");
const path = require("path");

router.get("/", auth, admin, (req, res) => {
  res.render("add", {
    title: "Добавить пользователя",
    isAdd: true,
    registrationError: req.flash("registrationError"),
  });
});

router.post("/", auth, admin, async (req, res) => {
  const { login } = req.body;
  const candidate = await User.findOne({ login });
  if (!candidate) {
    const hashPassword = await bcrypt.hash(req.body.login, 10);
    const user = new User({
      name: req.body.name,
      login: req.body.login,
      img: req.body.img,
      admin: req.body.admin,
      limit: req.body.limit,
      block: req.body.block,
      password: hashPassword,
    });
    try {
      await user.save();
      //   fs.copyFile(
      //    path.join(__dirname, "..", "data", "users.json"),
      //    path.join(__dirname, "..", "data", "users.txt"),
      //    (err) => {
      //      if (err) throw err;
      //    }
      //  );
      res.redirect("/users");
    } catch (e) {
      console.log(e);
    }
  } else {
    req.flash("registrationError", "Пользователь с таким логином уже существует");
    res.redirect("/add");
  }

});

module.exports = router;
