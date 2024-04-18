const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

beforeEach(() => seed(testData));
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
        expect(response.body.articles[0].title).toBe(
          "Living in the shadow of a great man"
        );
        expect(response.body.articles[0].topic).toBe("mitch");
        expect(response.body.articles[0].author).toBe("butter_bridge");
        expect(response.body.articles[0].body).toBe(
          "I find this existence challenging"
        );
        expect(response.body.articles[0].created_at).toBe(
          "2020-07-09T20:11:00.000Z"
        );
        expect(response.body.articles[0].votes).toBe(100);
        expect(response.body.articles[0].article_img_url).toEqual(
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
