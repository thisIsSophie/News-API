const request = require("supertest");
const app = require("../app");

describe("/api", () => {
  test("GET: 200 sends an object of endpoint /api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          "GET /api": expect.objectContaining({
            description: expect.any(String),
          }),
        });
      });
  });
  test("GET: 200 sends an object of endpoint /api/topics", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          "GET /api/topics": expect.objectContaining({
            description: expect.any(String),
            queries: [],
            exampleResponse: expect.any(Object),
          }),
        });
      });
  });

  test("GET: 200 sends an object of endpoint /api/articles", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          "GET /api/articles": expect.objectContaining({
            description: expect.any(String),
            queries: [],
            exampleResponse: expect.any(Object),
          }),
        });
      });
  });
  test("GET: 200 sends an object of endpoint /api/articles/:article_id", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          "GET /api/articles/:article_id": expect.objectContaining({
            description: expect.any(String),
            queries: [],
            exampleResponse: expect.any(Object),
          }),
        });
      });
  });

  test("POST: 201 sends an object of endpoint /api/articles/:article_id", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          "POST /api/articles/:article_id/comments": expect.objectContaining({
            description: expect.any(String),
            queries: [],
            exampleResponse: expect.any(Object),
          }),
        });
      });
  });
});
