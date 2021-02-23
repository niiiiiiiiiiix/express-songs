const request = require("supertest");
const app = require("../app");

describe("App", () => {
  it("should pass", () => {
    expect(1).toBe(1);
  });
});

describe("App", () => {
  it("GET / should respond with Hello World", async () => {
    const response = await request(app).get("/");
    // const response = await request(app).get("/").expect(200); then can remove expect...toBe(200)

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World");
  });

  it("GET / should respond with Hello World", async () => {
    const { text, status } = await request(app).get("/");

    expect(status).toBe(200);
    expect(text).toBe("Hello World");
  });

  it("POST / should throw error when sending non-json content", async () => {
    const { text } = await request(app).post("/").send("non-json").expect(400);
    expect(text).toBe("Server wants application/json!");
  });

  it("POST / should be successful when sending json content", async () => {
    const { text } = await request(app)
      .post("/")
      .send({ name: "nix" })
      .expect(201);

    expect(text).toBe("Thanks for the JSON!");
  });
});
