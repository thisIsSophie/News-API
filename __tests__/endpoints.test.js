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
  test("GET: 200 sends an object of endpoint /topics/api", () => {
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
});
