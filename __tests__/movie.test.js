const request = require("supertest");
const app = require("../app");

describe("movies", () => {
  it("POST /movies should return a new movie object", async () => {
    const newMovie = { movieName: "Lion King" };
    const { body } = await request(app)
      .post("/movies")
      .send(newMovie)
      .expect(201);
    expect(body).toMatchObject(newMovie);
  });
});
