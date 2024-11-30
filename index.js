const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("files", (err, files) => {
    res.render("index", { files: files });
  });
});

app.get("/file/:fileName", (req, res) => {
  fs.readFile(
    `files/${req.params.fileName}`,
    { encoding: "utf-8" },
    (err, fileData) => {
      res.render("note", { fileName: req.params.fileName, text: fileData });
    }
  );
});

app.get("/edit/:fileName", (req, res) => {
  res.render("edit", { fileName: req.params.fileName });
});

app.post("/edit", (req, res) => {
  fs.rename(
    `files/${req.body.previousTitle}.txt`,
    `files/${req.body.newTitle}.txt`,
    () => {
      res.redirect("/");
    }
  );
});

app.post("/create", (req, res) => {
  fs.writeFile(`files/${req.body.title}.txt`, req.body.text, () =>
    res.redirect("/")
  );
});

app.listen(3000, () => console.log("Server is runnng @PORT:3000"));
