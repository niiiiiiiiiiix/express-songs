const request = require("supertest");
const app = require("../app");
const Song = require("../models/song.model");
const dbHandlers = require("../test/dbHandler");

describe("App", () => {
  beforeAll(async () => await dbHandlers.connect());

  beforeEach(async () => {
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
    await Song.create(songsData);
  });
  afterEach(async () => await dbHandlers.clearDatabase());
  afterAll(async () => await dbHandlers.closeDatabase());

  it("GET should respond with all songs", async () => {
    const expectedSongsData = [
      {
        name: "song 1",
        artist: "artist 1",
      },
      {
        name: "song 2",
        artist: "artist 2",
      },
    ];
    const response = await request(app).get("/songs").expect(200);
    expect(response.body).toMatchObject(expectedSongsData);
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

  it("PUT /songs/:id should update the song entry", async () => {
    const song = await Song.findOne({ name: "song 1" });
    const response = await (await request(app).put(`/songs/${song.id}`))
      .send({ name: "song 1.1" })
      .expect(200);
    expect(response.body.name).toEqual("song 1.1");

    // const updatedSong = { name: "Pink Moon 2", artist: "Nick Drake 2" };
    // const expectedSong = {
    //   id: 1,
    //   name: "Pink Moon 2",
    //   artist: "Nick Drake 2",
    // };
    // const { body } = await request(app)
    //   .put("/songs/1")
    //   .send(updatedSong)
    //   .expect(200);
    // expect(body).toEqual(expectedSong);
  });

  it("DELETE /songs/:id should delete the correct song", async () => {
    const song = await Song.findOne({ name: "song 2" });
    const response = await (
      await request(app).delete(`/songs/${song.id}`)
    ).expect(200);
    expect(response.body.name).toEqual("song 2");

    // const deletedSong = { name: "Pink Moon 2", artist: "Nick Drake 2" };
    // const { body } = await request(app).delete("/songs/1").expect(200);
    // expect(body).toMatchObject(deletedSong);
  });
});
