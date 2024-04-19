const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe("/api/articles", () => {
  test("GET:200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("GET: 200 body property is not included in articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("GET:200 articles are sorted by most recent", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.title).toBe(
          "Living in the shadow of a great man"
        );
        expect(response.body.article.topic).toBe("mitch");
        expect(response.body.article.author).toBe("butter_bridge");
        expect(response.body.article.body).toBe(
          "I find this existence challenging"
        );
        expect(response.body.article.created_at).toBe(
          "2020-07-09T20:11:00.000Z"
        );
        expect(response.body.article.votes).toBe(100);
        expect(response.body.article.article_img_url).toEqual(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET: 404 returns not found if article does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .expect({ msg: "Unable to find Article by ID - 9999" });
  });
  test("GET: 400 returns bad request if ID not an integer", () => {
    return request(app)
      .get("/api/articles/potato")
      .expect(400)
      .expect({ msg: "ID must be an integer" });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 sends all comments by Article ID to the client", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);
        response.body.comments.forEach((comment) => {
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.votes).toBe("number");
        });
      });
  });
  test("GET: 404 returns not found if article does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .expect({ msg: "Unable to find Article by ID - 9999" });
  });

  test("Get 200: If no comments, returns an empty array", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .expect({ comments: [] });
  });
  test("POST 201: adds a comment to an article & returns comment to the client", () => {
    const newComment = {
      username: "butter_bridge",
      body: "what a lovely article",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("what a lovely article");
      });
  });
  test("POST 400: returns bad request when missing required fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .expect({ msg: "Missing required fields" });
  });

  test("POST 400: returns bad request for failing schema validation", () => {
    const newComment = {
      username: "butter_bridge",
      body: 76,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .expect({ msg: "Invalid data inputted" });
  });
  test("POST 400: returns invalid username if user does not exist", () => {
    const newComment = {
      username: "peanutButter",
      body: "not as good as peanut butter",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .expect({ msg: "Invalid Username: User does not exist" });
  });
});
