//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.connect('mongodb+srv://admin-emmanuel:PFsO5rqqBzDMAPGK@cluster0.x6wpm.mongodb.net/blogDB?retryWrites=true&w=majority/', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const composeSchema = {
  title: String,
  content: String
};

const Compose = mongoose.model("Compose", composeSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//home page
app.get("/", function(req, res){
  Compose.find({}, function(err, result){
    if (!err) {
      if (result) {
        res.render("home", {homeStartContent: homeStartingContent, blogPosts: result});
      }
      else {
        res.render("home", {homeStartContent: homeStartingContent});
      }
    }
  });

});

//about page
app.get("/about", function(req, res){
  res.render("about", {aboutStartContent: aboutContent});
});

//contact page
app.get("/contact", function(req, res){
  res.render("contact", {contactStartContent: contactContent});
});

//compose page
app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/posts/:postID", function(req, res){
  const postId = req.params.postID;

  Compose.findById(postId, function(err, result){
    res.render("post", {singlePostTitle: result.title, singlePostBody: result.content});
  });
});

//data retrieved from the compose page
app.post("/compose", function(req, res){
  const post = {title: req.body.postTitle, body: req.body.postBody}; //retrieve post content
  const postToDB = new Compose({
    title: post.title,
    content: post.body
  });
  postToDB.save().then(res.redirect("/")); //go back to the home page)
});


app.post("/delete", function(req, res){
  const deletePost = req.body.deletePost;
  Compose.findOneAndRemove({title: deletePost}).then(res.redirect("/"));
});


//wait for a connection
app.listen(process.env.PORT || 8000, function() {
  console.log("Server started on port 8000");
});
