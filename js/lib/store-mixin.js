/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import assign from 'lodash/object/assign';
import { EventEmitter } from 'events';

export default assign({}, EventEmitter.prototype, {
  page: 1,

  limit: 20,

  loading: false,

  cache: {},

  /**
   * Set a cache value
   * @param {string} key
   * @param {*} value
   * @param {Date|null} expiration
   */
  setCache(key, value, expiration) {
    this.cache[key] = {
      value,
      expire: expiration,
    };
    return this;
  },

  /**
   * Get a cache value
   * @param {string} key
   * @return {*|null}
   */
  getCache(key) {
    const c = this.cache[key];
    if (c && (!c.expire || c.expire < new Date())) {
      return c.value;
    }
    return null;
  },

  /**
   * Set the component store as loading
   * @param {boolean} loading
   */
  setLoading(loading) {
    this.loading = loading;
  },

  /**
   * Get the store's loading state
   * @return {boolean}
   */
  getLoading() {
    return this.loading;
  },

  emitChange() {
    this.emit(this._changeEvent);
    return this;
  },

  addChangeListener(callback) {
    this.on(this._changeEvent, callback);
    return this;
  },

  removeChangeListener(callback) {
    this.removeListener(this._changeEvent, callback);
    return this;
  },
});
