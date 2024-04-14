const express = require("express");
const router = express.Router();

const app = express();
app.use(express.static('public')); // 'public' is the directory name where images are stored

router.get('/', (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/", (req, res) => {
    res.render("main");
});

module.exports = router;
