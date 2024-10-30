import assign from 'lodash/object/assign';
import md5 from 'md5';
import storeMixin from './../lib/store-mixin';
import dispatcher from './../lib/dispatcher';
import actions from './../lib/actions';

// Private
let modals = [];

function clearAllModals() {
  modals = [];
}

function setModal(opts) {
  // Ensure we don't have multiple modals open
  clearAllModals();

  const id = md5(`${JSON.stringify(opts)}`);
  let insert = true;
  modals.map((modal) => {
    if (modal.id === id) {
      insert = false;
    }
  });
  if (insert) {
    modals.push(assign({ id }, opts));
  }
}

function clearModal(id) {
  modals = modals.filter((modal) => {
    return (modal.id === id) ? false : true;
  });
}
// Public
const MessageStore = assign({}, storeMixin, {
  changeEvent: actions.BIGSTOCK_MESSAGES_REFRESHED,

  getModals() {
    return modals;
  },
});

MessageStore.dispatcherId = dispatcher.register((event) => {
  switch (event.type) {
    case actions.ALERT_ERROR:
      alert(event.message.trim());
      break;
    case actions.INIT_MODAL:
      setModal(event.modal);
      MessageStore.emitChange();
      break;
    case actions.DISMISS_MODAL:
      clearModal(event.id);
      MessageStore.emitChange();
      break;
    case actions.DISMISS_ALL_MODALS:
      clearAllModals();
      MessageStore.emitChange();
      break;
    default:
      // Nothing to do
      break;
  }
});

export default MessageStore;
