const { Router } = require("express");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = Router();

router.get("/", auth, async (req, res) => {
  res.render("change", {
    title: "Сменить пароль",
    isChange: true,
    changeError: req.flash("changeError"),
  });
});

router.post("/", auth, async (req, res) => {
  try {
    const login = req.session.user.login;
    const candidate = await User.findOne({ login });
    const limit = candidate.limit === "on" ? true : false;
    const { opassword, password, confirm } = req.body;
    const areSame = await bcrypt.compare(opassword, candidate.password);
    if (areSame) {
      if (password !== confirm) {
        req.flash("changeError", "Пароли не совпадают");
        res.redirect("/change");
      } else {
        if (limit && (password.replace(/[A-Za-zА-Яа-яЁё]+$/, "") === "")) {
          req.flash(
            "changeError",
            "Ограничение пароля! Наличие латинских букв и символов кириллицы запрещено"
          );
          res.redirect("/change");
        } else {
          const hashPassword = await bcrypt.hash(password, 10);
          console.log('password: ', password);
          await User.updateOne(
            { login },
            { password: hashPassword },
            { upset: false }
          );
          res.redirect("/");
        }
      }
    } else {
      req.flash("changeError", "Неверный старый пароль");
      res.redirect("/change");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
