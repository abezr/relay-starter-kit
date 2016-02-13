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

export default class ToggleCompleteMutation extends Relay.Mutation {
  static fragments = {
    todo: () => Relay.QL`
      fragment on Todo {
        id,
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
    return Relay.QL`mutation{toggleComplete}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ToggleCompletePayload {
        todo {
          complete,
        },
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
        todo: this.props.todo.id,
        todoList: this.props.todoList.id,
      },
    }];
  }
  getVariables() {
    return {
      complete: this.props.complete,
      id: this.props.todo.id,
    };
  }
  getOptimisticResponse() {
    var todoList = this.props.todoList;
    var todoListPayload = {id: todoList.id};
    todoListPayload.areAllComplete = 
      todoList.todos.every(x => x.complete);
    
    return {
      todo: {
        complete: this.props.complete,
        id: this.props.todo.id,
      },
      todoList: todoListPayload,
    };
  }
}
