const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      "SELECT a.title, a.topic, a.author, a.created_at, a.article_id, a.votes, a.article_img_url, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles a LEFT JOIN comments ON a.article_id = comments.article_id GROUP BY a.title, a.topic, a.author, a.created_at, a.article_id, a.votes, a.article_img_url ORDER BY a.created_at DESC"
    )
    .then((result) => {
      return result.rows;
    });
};
