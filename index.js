const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const homeRoutes = require("./routes/home");
const changeRoutes = require("./routes/change");
const addRoutes = require("./routes/add");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const keys = require("./keys");

const app = express();

const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "main",
  extname: "hbs",
});

const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);
app.use("/", homeRoutes);
app.use("/change", changeRoutes);
app.use("/add", addRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     name: "Aisha Winx",
    //     login: "Aisha",
    //     img:
    //       "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7c6f1009-9bed-42c1-90b2-5672c47100ef/d9bngrl-bd7e7454-3e64-45ac-97a9-092798fdfa28.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvN2M2ZjEwMDktOWJlZC00MmMxLTkwYjItNTY3MmM0NzEwMGVmXC9kOWJuZ3JsLWJkN2U3NDU0LTNlNjQtNDVhYy05N2E5LTA5Mjc5OGZkZmEyOC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.OvNmd76cW_Ad1Kw4e2NWeOtwLD87WgkpuRcbVDUyO-Q",
    //     admin: "off",
    //     limit: "off",
    //     block: "off",
    //     password: login,
    //   });
    //   await user.save();
    // }
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT} port...`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
