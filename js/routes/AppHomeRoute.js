import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    viewer: () => Relay.QL`
      query {
        todoList
      }
    `,
  };
  //static routeName = 'AppHomeRoute';
}
