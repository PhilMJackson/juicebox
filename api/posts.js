const express = require("express");
const postsRouter = express.Router();

const { getAllPosts, createPost } = require("../db");
const { requireUser } = require('./utils');

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;
  const authorId = req.user.id;
  const tagArr = tags.trim().split(/\s+/);
  const postData = {authorId ,title, content};
  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    const post = await createPost(postData);
    if (post){
      res.send({ post });
    } else {
      next({
        name: "PostError",
        message: "Unable to Create Post",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts,
  });
});

module.exports = postsRouter;
