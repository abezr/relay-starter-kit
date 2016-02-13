export class Todo extends Object {}
export class TodoList extends Object {}

var assign = require('object-assign');

// Mock data
var _todos = {};
var _todoList = {todos:_todos};
var completedTodoId = create('Taste JavaScript');
update(completedTodoId, {complete: true});
create('Buy a unicorn');

module.exports = {
  create: text => {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _todos[id] = {
      id: id,
      complete: false,
      text: text
    };
    return id;
  },
  
  update: (id, updates) => {
    let todo = _todos[id],
      updated = Object.keys(updates).some(x => todo[x] !== updates[x]);
    if (needUpdate) {
      _todos[id] = Object.assign(todo, updates);
    }
    return updated;
  },
  
  destroy: id => {
    delete _todos[id];
    return id;
  },

  updateAll: updates => _todos
    .filter(x => x.update(x.id, updates))
    .map(todo => todo.id),
  
  destroyCompleted: () => _todos.filter(x => x.complete).map(destroy),

  areAllComplete: () => _todos.every(x => x.complete),

  getAll: () => _todos,

  getTodo: id => _todos[id],

  getTodoList: () => _todoList,

  // emitChange: () => {
  //   this.emit(CHANGE_EVENT);
  // },

  // addChangeListener: callback => {
  //   this.on(CHANGE_EVENT, callback);
  // },

  // removeChangeListener: callback => {
  //   this.removeListener(CHANGE_EVENT, callback);
  // },
  Todo,
  TodoList
};
