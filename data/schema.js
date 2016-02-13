/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  //GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  //cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import {
  Todo,
  TodoList,
  create,
  update,
  updateAll,
  destroy,
  destroyCompleted,
  areAllComplete,
  getAll,
  getTodo,
  getTodoList
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Todo') {
      return getTodo(id);
    } else if (type === 'TodoList') {
      return getTodoList();
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Todo) {
      return GraphQLTodo;
    } else if (obj instanceof TodoList) {
      return GraphQLTodoList;
    } else {
      return null;
    }
  }
);

var GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  description: 'A task to do',
  fields: () => ({
    id: globalIdField('Todo'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
    complete: {
      type: GraphQLBoolean,
      resolve: (obj) => obj.complete,
    },
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {connectionType: todosConnection,
           edgeType: GraphQLTodoEdge,
} = connectionDefinitions({
               name: 'Todo', 
           nodeType: GraphQLTodo
});

var GraphQLTodoList = new GraphQLObjectType({
  name: 'TodoList',
  description: 'A list of tasks to do',
  fields: () => ({
    id: globalIdField('TodoList'),
    todos: {
      type: todosConnection,
      args: {},
      resolve: (obj) =>
        connectionFromArray(getAll(status), args),
    },
    areAllComplete: {
      type: GraphQLBoolean,
      resolve: () => areAllComplete(),
    }
  }),
  interfaces: [nodeInterface],
});

var commonFields = {
    todoList: {
      type: GraphQLTodoList,
      resolve: () => getTodoList(),
    },
};

var rootType = new GraphQLObjectType({
  name: 'Root',
  fields: Object.assign({
    node: nodeField,
  }, commonFields),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var createMutation = new GraphQLObjectType({
  name: 'CreateTodo',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: Object.assign({
    todoEdge: {
      type: GraphQLTodoEdge,
      resolve: ({localTodoId}) => {
        var todo = getTodo(localTodoId);
        return {
          cursor: cursorForObjectInConnection(getAll(), todo),
          node: todo,
        };
      },
    },
  }, commonFields),
  mutateAndGetPayload: ({text}) => {
    var localTodoId = create(text);
    return {localTodoId};
  },
});


var updateOutputFields = Object.assign({
    todo: {
      type: GraphQLTodo,
      resolve: ({localTodoId}) => getTodo(localTodoId),
    }
  }, commonFields);

var updateTextMutation = mutationWithClientMutationId({
  name: 'UpdateText',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: updateOutputFields,
  mutateAndGetPayload: ({id, complete}) => {
    var localTodoId = fromGlobalId(id).id;
    update(localTodoId, {complete});
    return {localTodoId};
  },
});

var toggleCompleteMutation = mutationWithClientMutationId({
  name: 'ToggleComplete',
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: updateOutputFields,
  mutateAndGetPayload: ({id, complete}) => {
    var localTodoId = fromGlobalId(id).id;
    update(localTodoId, {complete});
    return {localTodoId};
  },
});

var toggleCompleteAllMutation = mutationWithClientMutationId({
  name: 'ToggleCompleteAllTodos',
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: Object.assign({
    changedTodos: {
      type: new GraphQLList(GraphQLTodo),
      resolve: ({changedTodoLocalIds}) => changedTodoLocalIds.map(getTodo),
    }
  }, commonFields),
  mutateAndGetPayload: ({complete}) => {
    var changedTodoLocalIds = updateAll({complete});  //TODO: check syntax correctness
    return {changedTodoLocalIds};
  },
});

var destroyMutation = mutationWithClientMutationId({
  name: 'DestroyTodo',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: commonFields,
  mutateAndGetPayload: ({id}) => {
    var localTodoId = fromGlobalId(id).id;
    destroy(localTodoId);
  },
});

var destroyCompletedMutation = mutationWithClientMutationId({
  name: 'DestroyCompletedTodos',
  outputFields: Object.assign({
    destroyedTodoIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({destroyedTodoIds}) => destroyedTodoIds,
    }
  }, commonFields),
  mutateAndGetPayload: () => {
    var destroyedTodoLocalIds = destroyCompleted();
    var destroyedTodoIds = destroyedTodoLocalIdsTodoLocalIds.map(toGlobalId.bind(null, 'Todo'));
    return {deletedTodoIds};
  },
});

var Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createTodo: createMutation,
    updateText: updateTextMutation,
    toggleComplete: toggleCompleteMutation,
    toggleCompleteAll: toggleCompleteAllMutation,
    destroyTodo: destroyMutation,
    destroyCompletedTodos: destroyCompletedMutation,
  },
});

export var schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation,
});
