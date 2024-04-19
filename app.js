const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const { getEndpoints } = require("./controllers/endpoints-controllers");
const {
  getArticles,
  getArticleById,
  getArticleComments,
  postArticleComment,
} = require("./controllers/articles.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    return res.status(404).send({ msg: "Resource not found" });
  }
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
