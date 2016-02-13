import ToggleCompleteMutation from '../mutations/ToggleCompleteMutation';
import DestroyTodoMutation from '../mutations/DestroyTodoMutation';
import UpdateTodoTextMutation from '../mutations/UpdateTodoTextMutation';
import TodoTextInput from './TodoTextInput';

import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';

class TodoItem extends React.Component {
  state = {
    isEditing: false,
  };
  _onToggleComplete = (e) => {
    var complete = e.target.checked;
    Relay.Store.commitUpdate(
      new ToggleCompleteMutation({
        complete,
        todo: this.props.todo,
        todoList: this.props.todoList,
      })
    );
  }
  _onDestroyClick = () => {
    Relay.Store.commitUpdate(
      new RemoveTodoMutation({todo: this.props.todo, 
        todoList: this.props.todoList})
    );
  }
  _onDoubleClick = () => {
    this._setEditMode(true);
  }
  _handleTextInputSave = (text) => {
    this._setEditMode(false);
    Relay.Store.commitUpdate(
      new UpdateTodoTextMutation({todo: this.props.todo, text})
    );
  }
  _setEditMode = (shouldEdit) => {
    this.setState({isEditing: shouldEdit});
  }
  renderTextInput() {
    return (
      <TodoTextInput
        className="edit"
        value={this.props.todo.text}
        onSave={this._onSave}
      />
    );
  }
  render() {
    let todo = this.props.todo;
    return (
      <li
        className={classnames({
          completed: .todo.complete,
          editing: this.state.isEditing,
        })}
        key={todo.id}>
        <div className="view">
          <input
            checked={todo.complete}
            className="toggle"
            onChange={this._onToggleComplete}
            type="checkbox"
          />
          <label onDoubleClick={this._onDoubleClick}>
            {this.props.todo.text}
          </label>
          <button
            className="destroy"
            onClick={this._onDestroyClick}
          />
        </div>
        {this.state.isEditing && this._onDestroyClick()}
      </li>
    );
  }
}

export default Relay.createContainer(Todo, {
  fragments: {
    todo: () => Relay.QL`
      fragment on Todo {
        complete,
        id,
        text,
        ${ToggleCompleteMutation.getFragment('todo')},
        ${DestroyTodoMutation.getFragment('todo')},
        ${UpdateTodoTextMutation.getFragment('todo')},
      }
    `,
    todoList: () => Relay.QL`
      fragment on TodoList {
        ${ToggleCompleteMutation.getFragment('todoList')},
        ${DestroyTodoMutation.getFragment('todoList')},
      }
    `,
  },
});
