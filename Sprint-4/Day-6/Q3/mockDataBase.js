const request = require("supertest");
const app = require("./todoApi");

describe("To-Do API Integration Tests", () => {
  test("should create a new to-do and return it", async () => {
    const newTodo = { id: "1", text: "Test To-Do" };

    const response = await request(app).post("/todos").send(newTodo);

    expect(response.status).toBe(201);
    expect(response.body.text).toBe("Test To-Do");
  });

  test("should get all to-dos", async () => {
    const response = await request(app).get("/todos");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should update a to-do", async () => {
    const updatedTodo = { text: "Updated To-Do" };

    const response = await request(app).put("/todos/1").send(updatedTodo);

    expect(response.status).toBe(200);
    expect(response.body.text).toBe("Updated To-Do");
  });

  test("should delete a to-do", async () => {
    const response = await request(app).delete("/todos/1");
    expect(response.status).toBe(204);
  });
});
