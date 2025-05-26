const request = require("supertest");
const app = require("./sum");

beforeEach(() => {
  const todosModule = require("./sum");
  todosModule.todos = [];
});

test("should create a to-do", async () => {
  const todo = { id: "1", text: "Test To-Do" };
  const response = await request(app).post("/todos").send(todo);
  expect(response.status).toBe(201);
  expect(response.body.text).toBe(todo.text);
});

test("should return 400 for missing fields on create", async () => {
  const response = await request(app).post("/todos").send({ id: "2" });
  expect(response.status).toBe(400);
});

test("should get all to-dos", async () => {
  await request(app).post("/todos").send({ id: "1", text: "Test 1" });
  const response = await request(app).get("/todos");
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toBeGreaterThan(0);
});

test("should update a to-do", async () => {
  await request(app).post("/todos").send({ id: "1", text: "Old Text" });
  const response = await request(app)
    .put("/todos/1")
    .send({ text: "Updated Text" });
  expect(response.status).toBe(200);
  expect(response.body.text).toBe("Updated Text");
});

test("should return 404 if updating non-existing to-do", async () => {
  const response = await request(app).put("/todos/99").send({ text: "Test" });
  expect(response.status).toBe(404);
});

test("should return 400 if update is missing text", async () => {
  await request(app).post("/todos").send({ id: "1", text: "Old" });
  const response = await request(app).put("/todos/1").send({});
  expect(response.status).toBe(400);
});

test("should delete a to-do", async () => {
  await request(app).post("/todos").send({ id: "1", text: "To Delete" });
  const response = await request(app).delete("/todos/1");
  expect(response.status).toBe(200);
  expect(response.body.text).toBe("To Delete");
});

test("should return 404 when deleting non-existing to-do", async () => {
  const response = await request(app).delete("/todos/123");
  expect(response.status).toBe(404);
});
