import assign from 'lodash/object/assign';
import storeMixin from './../lib/store-mixin';
import dispatcher from './../lib/dispatcher';
import actions from './../lib/actions';

// Private
const errors = [];

function appendError(error) {
  errors.push(error);
}

// Public
const LoginStore = assign({}, storeMixin, {
  changeEvent: actions.LOGIN_UPDATED,

  getErrors() {
    return errors;
  },
});

LoginStore.dispatcherId = dispatcher.register((event) => {
  switch (event.type) {
    case actions.USER_LOGIN_ERROR_REFRESHED :
      appendError(event.collection);
      LoginStore.emitChange();
      break;
    default:
      // Nothing to do
      break;
  }
});

export default LoginStore;
