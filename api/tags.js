const express = require("express");
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags,
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  // read the tagname from the params
  const tagName = req.params.tagName;
  try {
    // use our method to get posts by tag name from the db
    const allPosts = await getPostsByTagName(tagName);

    const posts = allPosts.filter((post) => {
      return (
        (post.active && post.author.active) ||
        (req.user && post.author.id === req.user.id)
      );
    });
    // send out an object to the client { posts: // the posts }
    if (posts.length > 0) {
      res.send({ posts: posts });
    } else {
      next({
        name: "UnmatchedTags",
        message: "No posts match that tag name",
      });
    }
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({ name, message });
  }
});

module.exports = tagsRouter;
