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
});

describe("App", () => {
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

  it("GET /songs should be successful in returning the full song list", async () => {
    const { body } = await request(app).get("/songs").expect(200);

    expect(body).toEqual([
      {
        id: 1,
        name: "someSongName",
        artist: "someSongArtist",
      },
    ]);
  });

  it("POST /songs should be successful in adding item", async () => {
    const newSong = {
      name: "Pink Moon",
      artist: "Nick Drake",
    };
    const expectedSong = {
      id: 2,
      name: "Pink Moon",
      artist: "Nick Drake",
    };

    const { body: actualSong } = await request(app)
      .post("/songs")
      .send(newSong)
      .expect(201);
    expect(actualSong).toEqual(expectedSong);
  });

  it("GET /songs/:id should return the correct song", async () => {
    const expectedSong = { name: "Pink Moon", artist: "Nick Drake" };
    const { body: actualSong } = await request(app).get("/songs/2").expect(200);

    expect(actualSong).toMatchObject(expectedSong);
  });
});
