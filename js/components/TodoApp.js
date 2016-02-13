var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');
var React = require('react');
var TodoStore = require('../stores/TodoStore');

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getTodoState() {
  return {
    allTodos: TodoStore.getAll(),
    areAllComplete: TodoStore.areAllComplete()
  };
}

var TodoApp = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      let todoList = this.props.todoList;
      <div>
        <TodoListHeader todoList={todoList} />
        <TodoListMainSection
          allTodos={todoList.todos}
          areAllComplete={todoList.areAllComplete}
        />
        <TodoListFooter allTodos={todoList.todos} />
      </div>
    );
  }

});

module.exports = TodoApp;
