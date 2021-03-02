const request = require("supertest");
const app = require("../app");
const Song = require("../models/song.model");
const dbHandlers = require("../test/dbHandler");
// const User = require("../models/user.model");
const createJWTToken = require("../config/jwt");

describe("App", () => {
  let token;
  const songsData = [
    {
      name: "song 1",
      artist: "artist 1",
    },
    {
      name: "song 2",
      artist: "artist 2",
    },
  ];

  beforeAll(async () => {
    await dbHandlers.connect();
    // const user = new User({ username: "username", password: "password" });
    // await user.save();

    token = createJWTToken("user.username");
  });

  beforeEach(async () => {
    await Song.create(songsData);
  });
  afterEach(async () => await dbHandlers.clearDatabase());
  afterAll(async () => await dbHandlers.closeDatabase());

  it("GET should respond with all songs", async () => {
    const response = await request(app).get("/songs").expect(200);
    expect(response.body.length).toEqual(2);
  });

  it("POST /songs should be successful in adding item", async () => {
    const newSong = {
      name: "Pink Moon",
      artist: "Nick Drake",
    };
    const expectedSong = {
      name: "Pink Moon",
      artist: "Nick Drake",
    };

    const { body: actualSong } = await request(app)
      .post("/songs")
      .send(newSong)
      .expect(201);
    expect(actualSong).toMatchObject(expectedSong);
  });

  it("GET /songs/:id should return the correct song", async () => {
    const song = await Song.findOne({ name: "song 1" });
    const response = await request(app).get(`/songs/${song.id}`).expect(200);
    expect(response.body.name).toEqual("song 1");

    // const expectedSong = { name: "Pink Moon", artist: "Nick Drake" };
    // const { body: actualSong } = await request(app).get("/songs/2").expect(200);
    // we can actually just use "body" instead of "body:actualSong"
    // body:actualSong is to rename the response to something that is more meaningful

    // so if we use body then it can just be expect(body)....
  });

  describe("DELETE /:id", () => {
    it("should throw error if unauthorised", async () => {
      const song = await Song.findOne({ name: "song 2" });
      const response = await request(app).delete(`/songs/${song.id}`);

      expect(response.status).toBe(401);
    });

    it("should delete song successfully if authorised and given valid id", async () => {
      const song = await Song.findOne({ name: "song 1" });
      const response = await request(app)
        .delete(`/songs/${song.id}`)
        .set("Cookie", `token=${token}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("song 1");
    });
  });

  describe("PUT /:id", () => {
    it("should modify correct song successfully if authorised and given valid id", async () => {
      const song = await Song.findOne({ name: "song 1" });
      const response = await request(app)
        .put(`/songs/${song.id}`)
        .send({ name: "123" })
        .set("Cookie", `token=${token}`);
      expect(response.status).toBe(200);
      // expect(response.body.name).toBe("123");
      expect(response.body).toMatchObject({ name: "123", artist: "artist 1" });
    });

    it("should throw error if unauthorised", async () => {
      const song = await Song.findOne({ name: "song 1" });
      const response = await request(app)
        .put(`/songs/${song.id}`)
        .send({ name: "123" });
      expect(response.status).toBe(401);
    });
  });
});
