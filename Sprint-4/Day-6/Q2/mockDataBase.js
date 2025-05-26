const mockDatabase = {
  todos: [],
  addTodo: (todo) => mockDatabase.todos.push(todo),
  getTodos: () => mockDatabase.todos,
  updateTodo: (id, updatedTodo) => {
    const index = mockDatabase.todos.findIndex((todo) => todo.id === id);
    if (index === -1) return null;
    mockDatabase.todos[index] = {
      ...mockDatabase.todos[index],
      ...updatedTodo,
    };
    return mockDatabase.todos[index];
  },
  deleteTodo: (id) => {
    const index = mockDatabase.todos.findIndex((todo) => todo.id === id);
    if (index === -1) return null;
    mockDatabase.todos.splice(index, 1);
    return true;
  },
};

module.exports = mockDatabase;
