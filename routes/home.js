const { Router } = require("express");
const auth = require('../middleware/auth');
const router = Router();

router.get("/", auth, (req, res) => {
  res.render("index", {
    title: "Главная страница",
    isHome: true,
    name: req.session.user.name
  });
});

module.exports = router;
