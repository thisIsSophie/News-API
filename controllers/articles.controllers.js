const {
  selectArticles,
  selectArticleById,
  selectArticleComments,
} = require("../models/articles-models");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (!Number.isInteger(+article_id)) {
    return res.status(400).send({ msg: "ID must be an integer" });
  }
  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res
          .status(404)
          .send({ msg: `Unable to find Article by ID - ${article_id}` });
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res
          .status(404)
          .send({ msg: `Unable to find Article by ID - ${article_id}` });
      }
      selectArticleComments(article_id)
        .then((comments) => {
          res.status(200).send({ comments });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};
