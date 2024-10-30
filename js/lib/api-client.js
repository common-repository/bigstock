import assign from 'lodash/object/assign';
import request from 'superagent';
import legacyiesupport from 'superagent-legacyiesupport';
import Promise from 'bluebird';

const BASEURL = `${process.env.URL}`;
const HEADERS = { };

const apiClient = {
  get(url, query = {}, headers = {}) {
    return new Promise((res, rej) => {
      request.get(`${BASEURL}${url}`)
        .use(legacyiesupport)
        .set(assign(headers, HEADERS))
        .query(query)
        .end((err, response) => {
          if (err) return rej(err);
          return res(response);
        });
    });
  },

  post(url, data = {}, query = {}, headers = {}) {
    return new Promise((res, rej) => {
      request.post(`${BASEURL}${url}`)
        .set(assign(headers, HEADERS))
        .query(query)
        .send(data)
        .end((err, response) => {
          if (err) return rej(err);
          return res(response);
        });
    });
  },

  put(url, data = {}, query = {}, headers = {}) {
    return new Promise((res, rej) => {
      request.put(`${BASEURL}${url}`)
        .set(assign(headers, HEADERS))
        .query(query)
        .send(data)
        .end((err, response) => {
          if (err) return rej(err);
          return res(response);
        });
    });
  },

  patch(url, data = {}, query = {}, headers = {}) {
    return new Promise((res, rej) => {
      request.patch(`${BASEURL}${url}`)
        .set(assign(headers, HEADERS))
        .query(query)
        .send(data)
        .end((err, response) => {
          if (err) return rej(err);
          return res(response);
        });
    });
  },

  delete(url, query = {}, headers = {}) {
    return new Promise((res, rej) => {
      request.del(`${BASEURL}${url}`)
        .set(assign(headers, HEADERS))
        .query(query)
        .end((err, response) => {
          if (err) return rej(err);
          return res(response);
        });
    });
  },
};

window.apiClient = apiClient;
export default apiClient;
