import assign from 'lodash/object/assign';
import storeMixin from './../lib/store-mixin';
import dispatcher from './../lib/dispatcher';
import utils from './../lib/utils';
import actions from './../lib/actions';

// Private
let user = {};
let token = null;

function removeUser() {
  user = {};
  utils.removeToken();
}

function setUser(updatedUser) {
  user = utils.formatUser(updatedUser);
}

function setToken(updatedToken) {
  token = updatedToken;
}

function setTosAgreement(bool) {
  user.tos_agree = bool;
}

// Public
const BigstockStore = assign({}, storeMixin, {
  changeEvent: actions.BIGSTOCK_LAYOUT_UPDATED,

  getUser() {
    return user;
  },

  getToken() {
    return token;
  },

  hasAgreedToTos() {
    return user.tos_agree;
  },
});

BigstockStore.dispatcherId = dispatcher.register((event) => {
  switch (event.type) {
    case actions.USER_SESSION_REFRESHED :
      setUser(event.collection);
      BigstockStore.emitChange();
      break;
    case actions.USER_TOKEN_REFRESHED :
      setToken(event.collection);
      BigstockStore.emitChange();
      break;
    case actions.USER_LOGIN_REFRESHED :
      setUser(event.collection);
      BigstockStore.emitChange();
      break;
    case actions.REMOVE_USER_SESSION :
      removeUser();
      setToken(null);
      BigstockStore.emitChange();
      break;
    case actions.UPDATE_TOS_AGREEMENT :
      setTosAgreement(event.tosAgreement);
      BigstockStore.emitChange();
      break;
    default:
      // Nothing to do
      break;
  }
});

export default BigstockStore;
