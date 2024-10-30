/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

/** Dependencies */
import app from 'ampersand-app';
import React from 'react';
import ReactDOM from 'react-dom';
import utils from './lib/utils';
import dispatcher from './lib/dispatcher';
import actions from './lib/actions';
import webService from './lib/web-service';

// Immediately start listening for events
webService.register();

/** Main Layout */
import BigstockPhoto from 'components/bigstock';

app.extend({

  _init: false,

  /**
   * Dispatch an array of events
   * @param {Array|*} events
   */
  dispatch(events = []) {
    events.map((e) => {
      dispatcher.dispatch(e);
    });
  },

  /**
   * Initialize our React application and render
   * @param {object} el
   */
  init(el) {
    if (!this._init) {
      const token = utils.getToken();
      const events = [{ type: actions.REFRESH_USER_SESSION }];
      if (token) {
        events.push({ type: actions.USER_TOKEN_REFRESHED, collection: token });
      }
      this.dispatch(events);
      ReactDOM.render(<BigstockPhoto />, el);
    } else {
      // Make sure we reset React otherwise we'll have bajillions of listeners
      ReactDOM.unmountComponentAtNode(this._init);
      ReactDOM.render(<BigstockPhoto />, el);
    }

    this._init = el;
  },
});

export default app;
