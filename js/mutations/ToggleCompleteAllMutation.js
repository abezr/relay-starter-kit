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

import Relay from 'react-relay';

export default class ToggleCompleteAllMutation extends Relay.Mutation {
  static fragments = {
    todos: () => Relay.QL`
      fragment on TodoConnection {
        edges {
          node {
            id,
          },
        },
      }
    `,
    todoList: () => Relay.QL`
      fragment on TodoList {
        id,
        areAllComplete,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{toggleCompleteAll}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ToggleCompleteAllPayload {
        todoList {
          areAllComplete,
          todos,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        todoList: this.props.todoList.id,
      },
    }];
  }
  getVariables() {
    return {
      complete: this.props.complete,
    };
  }
  getOptimisticResponse() {
    var todoList = this.props.todoList;
    var todoListPayload = {id: todoList.id};
    if (this.props.todos && this.props.todos.edges) {
      todoListPayload.todos = {
        var newValue = todoList.areAllComplete || false;
        edges: this.props.todos.edges
          .filter(edge => edge.node.complete !== newValue)
          .map(edge => ({
            node: {
              complete: newValue,
              id: edge.node.id,
            },
          })),
      };
    }
    todoList.areAllComplete = true;
    return {
      todoList: todoListPayload,
    };
  }
}
