const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const expressSantizer = require('express-sanitizer');
//app config
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSantizer());
app.use(methodOverride("_method"));
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

  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.redirect('/blogs/new');
    } else {
      res.redirect('/');
    }
  });

});
//show
app.get('/blogs/:id', function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});
//edit
app.get('/blogs/:id/edit', function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });

});
//update
app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });

});
//Delete
app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndRemove(req.params.id, req.body.blog, function (err) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});
app.listen(3000, function () {
  console.log("Listening");
});
