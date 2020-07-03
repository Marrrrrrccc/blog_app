const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//app config
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//Mongoose/Model config
const blogSchema = mongoose.Schema({
  name: String,
  image: String,
  body: String,
  date: { type: Date, default: Date.now },
});
const Blog = mongoose.model("Blog", blogSchema);

//Restful routes
app.get("/", function (req, res) {
  res.redirect("/blogs");
});
//Index
app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    }
    res.render("index", { blogs: blogs });
  });
});
//new
app.get('/blogs/new', function (req, res) {
  res.render("new");
});
//create
app.post('/blogs', function (req, res) {
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.redirect('/blogs/new');
    } else {
      res.redirect('/');
    }
  });

});

app.listen(3000, function () {
  console.log("Listening");
});
