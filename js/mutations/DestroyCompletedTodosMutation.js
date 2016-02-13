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

export default class DestroyCompletedTodosMutation extends Relay.Mutation {
  static fragments = {
    todos: () => Relay.QL`
      fragment on TodoConnection {
        edges {
          node {
            complete,
            id,
          },
        },
      }
    `,
    todoList: () => Relay.QL`
      fragment on TodoList {
        areAllCompleted,
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{destroyCompletedTodos}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DestroyCompletedTodosPayload {
        deletedTodoIds,
        todoList {
          areAllCompleted,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'todoList',
      parentID: this.props.todoList.id,
      connectionName: 'todos',
      deletedIDFieldName: 'deletedTodoIds',
    }];
  }
  getVariables() {
    return {};
  }
  getOptimisticResponse() {
    var deletedTodoIds;
    var newTotalCount;
    if (this.props.todos && this.props.todos.edges) {
      deletedTodoIds = this.props.todos.edges
        .filter(edge => edge.node.complete)
        .map(edge => edge.node.id);
      areAllCompleted = deletedTodoIds.length 
                          === this.props.todos.edges.lentgh;
    }
    var {areAllCompleted} = this.props.todoList;
    if (completedCount != null && totalCount != null) {

    }
    return {
      deletedTodoIds,
      todoList: {
        id: this.props.todoList.id,
        areAllCompleted: areAllCompleted,
      },
    };
  }
}
