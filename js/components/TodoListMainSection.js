/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import ToggleCompleteAllMutation from '../mutations/ToggleCompleteAllMutation';
import TodoItem from './TodoItem';

import React from 'react';
import Relay from 'react-relay';

class TodoListMainSection extends React.Component {
  _onToggleCompleteAll = (e) => {
    var complete = e.target.checked;
    Relay.Store.commitUpdate(
      new ToggleCompleteAllMutation({
        complete,
        todos: this.props.todoList.todos,
        todoList: this.props.todoList,
      })
    );
  }
  renderTodos() {
    return this.props.viewer.todos.edges.map(edge =>
      <Todo
        key={edge.node.id}
        todo={edge.node}
        viewer={this.props.viewer}
      />
    );
  }
  render() {
    let allTodos = this.props.allTodos;
    var todoItems = Object.keys(allTodos).map(key => 
      <TodoItem key={key} todo={allTodos[key]} />);

    if (todoItems.length < 1) {
      return null;
    }
    var numTodos = this.props.viewer.totalCount;
    var numCompletedTodos = this.props.viewer.completedCount;
    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          checked={this.props.areAllComplete ? 'checked' : ''}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">{todos}</ul>
      </section>
    );
  }
}

export default Relay.createContainer(TodoList, {
  initialVariables: {
    complete: null,
  },

  fragments: {
    todoList: () => Relay.QL`
      fragment on TodoList {
        areAllComplete,
        todos(complete: $status) {
          edges {
            node {
              id,
              ${Todo.getFragment('todo')},
            },
          },
          ${ToggleCompleteAllMutation.getFragment('todos')},
        },
        ${ToggleCompleteAllMutation.getFragment('todoList')},
        ${Todo.getFragment('todoList')},
      }
    `,
  },
});
