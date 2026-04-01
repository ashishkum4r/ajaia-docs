const request = require("supertest");
const app = require("../server");

let token;
let docId;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "alice@ajaia.com", password: "password123" });
  token = res.body.token;
});

describe("Documents API", () => {
  test("creates a document", async () => {
    const res = await request(app)
      .post("/api/documents")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Doc", content: "<p>Hello</p>" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Doc");
    docId = res.body.id;
  });

  test("fetches document list", async () => {
    const res = await request(app)
      .get("/api/documents")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.owned.length).toBeGreaterThan(0);
  });

  test("updates a document", async () => {
    const res = await request(app)
      .patch(`/api/documents/${docId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  test("rejects access without token", async () => {
    const res = await request(app).get("/api/documents");
    expect(res.statusCode).toBe(401);
  });
});
