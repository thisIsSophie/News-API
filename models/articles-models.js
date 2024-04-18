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
      console.log(result.rows);
      return result.rows;
    });
};