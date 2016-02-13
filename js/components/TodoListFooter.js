import AddTodoMutation from '../mutations/AddTodoMutation';
import TodoListFooter from './TodoListFooter';
import TodoListHeader from './TodoListHeader';
import MainSection from './MainSection';
import TodoTextInput from './TodoTextInput';

import React from 'react';
import Relay from 'react-relay';

class TodoApp extends React.Component {
  render() {
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
}
  

export default Relay.createContainer(TodoApp, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on TodoList {
        totalCount,
        ${TodoListHeader.getFragment('todoList')},
        ${TodoListMainSection.getFragment('todoList')},
        ${TodoListFooter.getFragment('todoList')},
      }
    `,
  },
});
