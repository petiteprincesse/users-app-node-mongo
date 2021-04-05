const { Router } = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = Router();
const fs = require("fs");
const path = require("path");

router.get("/", auth, admin, async (req, res) => {
  // const users = await User.getAll();
  const users = await User.find();
  // fs.copyFile(
  //   path.join(__dirname, "..", "data", "users.txt"),
  //   path.join(__dirname, "..", "data", "users.json"),
  //   (err) => {
  //     if (err) throw err;
  //   }
  // );
  res.render("users", {
    title: "Пользователи",
    isUsers: true,
    users,
  });
});

router.get("/:id/edit", auth, admin, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  // const user = await User.getById(req.params.id);

  const user = await User.findById(req.params.id);
  res.render("user-edit", {
    title: `Редактировать ${user.name}`,
    user,
  });
});

router.post("/edit", auth, admin, async (req, res) => {
  // какой то костыль, лень исправлять, пять часов утра уже мать твою
  if (!req.body.admin) {
    req.body.admin = "";
  }
  if (!req.body.limit) {
    req.body.limit = "";
  }
  if (!req.body.block) {
    req.body.block = "";
  }

  const { id } = req.body;
  delete req.body.id;
  await User.findByIdAndUpdate(id, req.body);

  // await User.update(req.body);
  // fs.copyFile(
  //   path.join(__dirname, "..", "data", "users.json"),
  //   path.join(__dirname, "..", "data", "users.txt"),
  //   (err) => {
  //     if (err) throw err;
  //   }
  // );
  res.redirect("/users");
});

router.post("/remove", auth, admin, async (req, res) => {
  try {
    await User.deleteOne({
      _id: req.body.id,
    });

    res.redirect("/users");
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", auth, admin, async (req, res) => {
  // const user = await User.getById(req.params.id);
  const user = await User.findById(req.params.id);
  // fs.copyFile(
  //   path.join(__dirname, "..", "data", "users.txt"),
  //   path.join(__dirname, "..", "data", "users.json"),
  //   (err) => {
  //     if (err) throw err;
  //   }
  // );
  res.render("user", {
    layout: "empty",
    title: `Пользователь ${user.name}`,
    user,
  });
});

module.exports = router;
