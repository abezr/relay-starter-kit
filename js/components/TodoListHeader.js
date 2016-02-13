import CreateTodoMutation from '../mutations/CreateTodoMutation';
import TodoTextInput from './TodoTextInput';

import React from 'react';
import Relay from 'react-relay';

class TodoListHeader extends React.Component {
  /**
   * @return {object}
   */
  render: function() {
    return (
      <header id="header">
        <h1>todos</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={this._onSave}
        />
      </header>
    );
  },

  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param {string} text
   */
  _onSave: function(text) {
    Relay.Store.commitUpdate(
      new CreateTodoMutation({text, todoList: this.props.todoList})
    );
  }

});

export default Relay.createContainer(TodoListHeader, {
  fragments: {
    todoList: () => Relay.QL`
      fragment on User {
        totalCount,
        ${AddTodoMutation.getFragment('todoList')},
        ${TodoListGeader.getFragment('todoList')},
      }
    `,
  },
});
