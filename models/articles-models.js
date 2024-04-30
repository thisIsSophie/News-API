const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      "SELECT DISTINCT a.title, a.topic, a.author, a.created_at, a.article_id, a.votes, a.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles a LEFT JOIN comments ON a.article_id = comments.article_id GROUP BY a.title, a.topic, a.author, a.created_at, a.article_id, a.votes, a.article_img_url ORDER BY a.created_at DESC"
    )
    .then((result) => {
      return result.rows;
    });
};
exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectArticleComments = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
      [article_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};
exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
exports.removeArticleComment = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1;", [comment_id]);
};
