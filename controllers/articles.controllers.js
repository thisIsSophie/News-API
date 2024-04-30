const {
  selectArticles,
  selectArticleById,
  selectArticleComments,
  insertComment,
  updateArticleVotes,
  removeArticleComment,
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
  if (!Number.isInteger(+article_id)) {
    return res.status(400).send({ msg: "Article ID must be an integer" });
  }

  selectArticleById(article_id).then((article) => {
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
  });
};

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (!username || !body) {
    return res.status(400).send({ msg: "Missing required fields" });
  }
  if (typeof username !== "string" || typeof body !== "string") {
    return res.status(400).send({ msg: "Invalid data type inputted" });
  }
  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res
          .status(404)
          .send({ msg: `Unable to find Article by ID - ${article_id}` });
      }
      updateArticleVotes(article_id, inc_votes)
        .then((article) => {
          res.status(200).send({ article });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleComment = (req, res, next) => {
  const { comment_id } = req.params;
  selectArticleById(comment_id)
    .then((comment) => {
      if (!comment) {
        return res
          .status(404)
          .send({ msg: `Unable to find Comment by ID - ${comment_id}` });
      }
      removeArticleComment(comment_id)
        .then(() => {
          res.status(204).send();
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};
