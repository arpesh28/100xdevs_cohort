/*
  Implement a class `Todo` having below methods
    - add(todo): adds todo to list of todos
    - remove(indexOfTodo): remove todo from list of todos
    - update(index, updatedTodo): update todo at given index
    - getAll: returns all todos
    - get(indexOfTodo): returns todo at given index
    - clear: deletes all todos

  Once you've implemented the logic, test your code by running
*/

class Todo {
  constructor() {
    this.todos = [];
  }

  add(todo) {
    if (todo) this.todos.push(todo);
  }
  remove(index) {
    this.todos = this.todos.filter((todo, ind) => ind !== index);
  }
  update(index, updatedTodo) {
    this.todos = this.todos.map((todo, ind) => {
      if (ind === index) return updatedTodo;
      return todo;
    });
  }
  getAll() {
    return this.todos;
  }
  get(index) {
    if (index < this.todos.length) return this.todos[index];
    else return null;
  }
  clear() {
    this.todos = [];
  }
}

module.exports = Todo;
