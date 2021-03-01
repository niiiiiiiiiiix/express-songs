const request = require("supertest");
const app = require("../app");
const Song = require("../models/song.model");
const dbHandlers = require("../test/dbHandler");

describe("App", () => {
  beforeAll(async () => await dbHandlers.connect());

  beforeEach(async () => {
    const songData = [
      {
        name: "song 1",
        artist: "artist 1",
      },
    ];
    await Song.create(songData);
  });

  afterEach(async () => await dbHandlers.clearDatabase());
  afterAll(async () => await dbHandlers.closeDatabase());

  it("GET should respond with all songs", async () => {
    const expectedSongsData = [
      {
        name: "song 1",
        artist: "artist 1",
      },
    ];
    const response = await request(app).get("/songs").expect(200);
    expect(response.body).toMatchObject(expectedSongsData);
  });

  // it("GET /songs should be successful in returning the full song list", async () => {
  //   const { body } = await request(app).get("/songs").expect(200);

  //   expect(body).toMatchObject([
  //     {
  //       name: "song 1",
  //       artist: "artist 1",
  //     },
  //   ]);
  // });
});

//   it("POST /songs should be successful in adding item", async () => {
//     const newSong = {
//       name: "Pink Moon",
//       artist: "Nick Drake",
//     };
//     const expectedSong = {
//       id: 2,
//       name: "Pink Moon",
//       artist: "Nick Drake",
//     };

//     const { body: actualSong } = await request(app)
//       .post("/songs")
//       .send(newSong)
//       .expect(201);
//     expect(actualSong).toEqual(expectedSong);
//   });

//   it("GET /songs/:id should return the correct song", async () => {
//     const expectedSong = { name: "Pink Moon", artist: "Nick Drake" };
//     const { body: actualSong } = await request(app).get("/songs/2").expect(200);
//     // we can actually just use "body" instead of "body:actualSong"
//     // body:actualSong is to rename the response to something that is more meaningful

//     expect(actualSong).toMatchObject(expectedSong);
//     // so if we use body then it can just be expect(body)....
//   });

//   it("PUT /songs/:id should update the song entry", async () => {
//     const updatedSong = { name: "Pink Moon 2", artist: "Nick Drake 2" };
//     const expectedSong = {
//       id: 1,
//       name: "Pink Moon 2",
//       artist: "Nick Drake 2",
//     };
//     const { body } = await request(app)
//       .put("/songs/1")
//       .send(updatedSong)
//       .expect(200);
//     expect(body).toEqual(expectedSong);
//   });

//   it("DELETE /songs/:id should delete the correct song", async () => {
//     const deletedSong = { name: "Pink Moon 2", artist: "Nick Drake 2" };
//     const { body } = await request(app).delete("/songs/1").expect(200);
//     expect(body).toMatchObject(deletedSong);
//   });
// });
