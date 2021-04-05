const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = Router();

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
    loginError: req.flash("loginError"),
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const candidate = await User.findOne({ login });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        if (candidate.block === "on") {
          req.flash("loginError", "Пользователь заблокирован");
          res.redirect("/auth/login#login");
        } else {
          req.session.user = candidate;
          req.session.isAuthenticated = true;
          if (candidate.admin === "on") {
            req.session.isAdmin = true;
          }
          req.session.save((err) => {
            if (err) {
              throw err;
            }
            res.redirect("/");
          });
        }
      } else {
        req.flash("loginError", "Неверный пароль");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "Такого пользователя не существует");
      res.redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
