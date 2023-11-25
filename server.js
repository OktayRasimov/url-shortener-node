const express = require("express");
const mongoose = require("mongoose");
const app = express();
const ShortUrl = require("./models/ShortUrl");
const { nanoid } = require("nanoid");

mongoose.connect("mongodb://127.0.0.1/urlShortener");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl, short: nanoid() });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) {
    return res.status(400).send({ message: "No url found" });
  }

  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(3000, () => {
  console.log(`Server is listening`);
});
