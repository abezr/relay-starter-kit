import Relay from 'react-relay';

export default class CreateTodoMutation extends Relay.Mutation {
  static fragments = {
    todoList: () => Relay.QL`
      fragment on TodoList {
        id,
        areAllComplete,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{createTodo}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CreateTodoPayload {
        todoEdge,
        todoList {
          todos,
          totalCount,
        },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'todoList',
      parentID: this.props.todoList.id,
      connectionName: 'todos',
      edgeName: 'todoEdge',
      rangeBehaviors: {
        '': 'append',
        'status(any)': 'append',
        'status(active)': 'append',
        'status(completed)': null,
      },
    }];
  }
  getVariables() {
    return {
      text: this.props.text,
    };
  }
  getOptimisticResponse() {
    return {
      todoEdge: {
        node: {
          complete: false,
          text: this.props.text,
        },
      },
      todoList: {
        id: this.props.todoList.id,
        areAllComplete: this.props.todoList.every(x => x.complete),
      },
    };
  }
}
