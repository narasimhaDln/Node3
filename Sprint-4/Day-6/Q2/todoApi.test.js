const express = require("express");
const app = express();
app.use(express.json());
const request = require("supertest");
jest.mock("./mockDatabase");
const mockDatabase = require("./mockDataBase");

test("should mock adding a to-do", async () => {
  const todo = { id: "1", text: "Test To-Do" };
  mockDatabase.addTodo.mockImplementation(() => todo);

  const response = await request(app).post("/todos").send(todo);
  expect(response.status).toBe(201);
  expect(response.body.text).toBe(todo.text);
});

test("should mock a failed database operation", async () => {
  mockDatabase.updateTodo.mockImplementation(() => null);

  const response = await request(app)
    .put("/todos/non-existent-id")
    .send({ text: "Updated To-Do" });

  expect(response.status).toBe(404);
  expect(response.body.error).toBe("To-Do not found");
});
