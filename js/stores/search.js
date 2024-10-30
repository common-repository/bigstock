import assign from 'lodash/object/assign';
import storeMixin from './../lib/store-mixin';
import dispatcher from './../lib/dispatcher';
import actions from './../lib/actions';

// Private
let query = null;
const facets = {
  order: 'popular',
  orientation: [],
  accepts: [
    'photo',
  ],
  model_release: null,
  safesearch: 'y',
  exclude: null,
  page: 1,
  limit: 150,
  editorial: null,
  size: null,
  language: null,
  category: null,
};
let total = 0;
let results = [];
let paginationLinks = {};

function setQuery(newQuery) {
  query = newQuery;
}

function setTotal(newTotal) {
  total = newTotal;
}

function setFacet(facet, value) {
  facets[facet] = value;
}

function setResults(newResults) {
  results = newResults;
}

// Parse Pagination link
function setPaginationLinks(links) {
  if (links) {
    paginationLinks = links.split(', ').map((linkRel) => {
      return linkRel.split('; ').map((curr, idx) => {
        if (idx === 0) {
          return curr.substr(1, curr.length - 2);
        }
        if (idx === 1) {
          return /rel="(.+)"/.exec(curr)[1];
        }
      });
    }).reduce((obj, curr) => {
      obj[curr[1]] = curr[0];
      return obj;
    }, {});
  } else {
    paginationLinks = {};
  }
}

// Public
const SearchStore = assign({}, storeMixin, {
  changeEvent: actions.SEARCH_UPDATED,

  getQuery() {
    return query;
  },

  getTotal() {
    return total;
  },

  getFacets() {
    return facets;
  },

  getResults() {
    return results;
  },

  hasNext() {
    return !!paginationLinks.next;
  },

  hasPrevious() {
    return !!paginationLinks.previous;
  },
});

SearchStore.dispatcherId = dispatcher.register((event) => {
  switch (event.type) {
    case actions.REFRESH_SEARCH :
      SearchStore.setLoading(true);
      SearchStore.emitChange();
      break;
    case actions.REFRESH_SEARCH_QUERY :
      setQuery(event.query);
      SearchStore.emitChange();
      break;
    case actions.REFRESH_SEARCH_FACET :
      setFacet(event.facet, event.value);
      SearchStore.emitChange();
      break;
    case actions.SEARCH_LOADING :
      SearchStore.setLoading(event.loading);
      SearchStore.emitChange();
      break;
    case actions.SEARCH_REFRESHED:
      SearchStore.setLoading(false);
      setQuery(event.collection.query);
      setResults(event.collection.data);
      setTotal(event.collection.data.length);
      setPaginationLinks(event.links);
      SearchStore.emitChange();
      break;
    default:
      // Nothing to do
      break;
  }
});

export default SearchStore;
