import Relay from 'react-relay';

export default class DestroyTodoMutation extends Relay.Mutation {
  static fragments = {
    todo: () => Relay.QL`
      fragment on Todo {
        complete,
        id,
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
    return Relay.QL`mutation{destroyTodo}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DestroyTodoPayload {
        deletedTodoId,
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
      deletedIDFieldName: 'deletedTodoId',
    }];
  }
  getVariables() {
    return {
      id: this.props.todo.id,
    };
  }
  getOptimisticResponse() {
    //TODO:
    return {
      deletedTodoId: this.props.todo.id,
      todoList: todoListPayload,
    };
  }
}
