/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import radium from 'radium';
import assign from 'lodash/object/assign';
import bind from 'lodash/function/bind';
import dispatcher from './../lib/dispatcher';
import actions from './../lib/actions';
import SearchStore from './../stores/search';
import Results from './search/results';
import Facets from './search/facets';
import Pagination from './search/pagination';
import AccountInfo from './search/account-info';
import AjaxLoader from './ajax';
import utils from './../lib/utils';
import colors from './../lib/colors';

export default radium(React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    vw: React.PropTypes.number.isRequired,
    token: React.PropTypes.string,
  },

  getInitialState() {
    return {
      loading: SearchStore.getLoading(),
      query: SearchStore.getQuery(),
      facets: SearchStore.getFacets(),
      total: SearchStore.getTotal(),
      results: SearchStore.getResults(),
      hasNext: SearchStore.hasNext(),
      hasPrevious: SearchStore.hasPrevious(),
      resultsHeight: utils.getResultsHeight(),
    };
  },

  componentWillMount() {
    this.boundUpdate = bind(this.update, this);
  },

  componentDidMount() {
    SearchStore.addChangeListener(this.boundUpdate);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  componentWillUnmount() {
    SearchStore.removeChangeListener(this.boundUpdate);
    window.removeEventListener('resize', this.handleResize);
  },

  onChange(e) {
    this.setState({
      query: e.target.value,
    });
  },

  submit(e) {
    e.preventDefault();
    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH_QUERY,
      query: this.state.query,
    });
    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH_FACET,
      facet: 'page',
      value: 1,
    });
    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH,
      query: this.state.query,
      facets: assign(this.state.facets, { page: 1 }),
    });
  },

  update() {
    this.setState({
      loading: SearchStore.getLoading(),
      query: SearchStore.getQuery(),
      facets: SearchStore.getFacets(),
      total: SearchStore.getTotal(),
      results: SearchStore.getResults(),
      hasNext: SearchStore.hasNext(),
      hasPrevious: SearchStore.hasPrevious(),
      resultsHeight: utils.getResultsHeight(),
    });
  },

  handleResize() {
    this.setState({
      resultsHeight: utils.getResultsHeight(),
    });
  },

  render() {
    const styles = {
      search: {
        height: '100%',
        overflowY: 'hidden',
        overflowX: 'hidden',
      },

      stickySearchBar: {
        backgroundColor: colors.whiteSmoke,
        height: 'auto',
        display: 'block',
        width: '100%',
      },

      ajaxLoader: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },

      searchHeader: {
        padding: '1em',
      },

      searchInput: {
        backgroundColor: 'transparent',
        borderLeft: '0',
        borderRight: '0',
        borderTop: '0',
        borderBottom: `2px solid ${colors.gray}`,
        maxHeight: '46px',
        boxShadow: 'none',
        width: 'calc(100% - 152px)',
        padding: '10px 7px',
        fontSize: '18px',
        transition: '0.5s ease',
        ':focus': {
          borderBottom: `2px solid ${colors.blue}`,
        },
      },

      searchButton: {
        width: '114px',
        backgroundColor: colors.blue,
        color: colors.white,
        padding: '14px 18px',
        fontSize: '14px',
        borderRadius: '2px',
        border: '0',
        ':hover': {
          opacity: '0.8',
          cursor: 'pointer',
        },
      },

      searchElementFiltersLink: {
        color: colors.blue,
        textDecoration: 'underline',
        display: 'inline-block',
        fontSize: '14px',
        verticalAlign: 'middle',
        ':hover': {
          color: colors.gray,
          cursor: 'pointer',
        },
      },

      searchElementPagination: {
        display: 'inline-block',
      },

      searchElementUser: {
        float: 'right',
      },

      searchElementSearchBar: {
        display: 'inline-block',
        marginRight: '14px',
        width: '50%',
      },

      searchElementSearchBarUnderline: {
        borderColor: colors.blue,
      },

      searchResults: {
        height: '100%',
        width: '100%',
        position: 'relative',
      },
    };

    // Merge searchElements into each individual element
    [
      styles.searchElementSearchBar,
      styles.searchElementFilters,
      styles.searchElementPagination,
      styles.searchElementUser,
    ].map((searchEl) => {
      return assign(searchEl, styles.searchElements);
    });

    const results = (!this.state.loading) ?
      <Results results={this.state.results} query={this.state.query} height={this.state.resultsHeight} vw={this.props.vw} facets={this.state.facets} hasNext={this.state.hasNext} /> :
      <div style={styles.searchResults}>
        <AjaxLoader message={'Fetching the perfect images'} style={styles.ajaxLoader} />
      </div>;

    return (
      <div style={styles.search}>
        <form onSubmit={bind(this.submit, this)} style={styles.stickySearchBar} className="bsp-search-bar">
          <div style={styles.searchHeader}>
            <div style={styles.searchElementUser}>
              <AccountInfo user={this.props.user} vw={this.props.vw} />
            </div>
            <div style={styles.searchElementSearchBar}>
              <input
                type="text"
                key={'primary-search'}
                className="animate-border"
                style={styles.searchInput}
                placeholder="Find the perfect image ..."
                onChange={bind(this.onChange, this)}
                value={this.state.query}
              />
              <button style={styles.searchButton} key={`${this.state.query}-search`} onClick={bind(this.submit, this)}>
                Search
              </button>
            </div>
            <div style={styles.searchElementPagination}>
              <Pagination query={this.state.query} facets={this.state.facets} hasNext={this.state.hasNext} hasPrevious={this.state.hasPrevious} />
            </div>
          </div>
          <Facets query={this.state.query} facets={this.state.facets} />
        </form>
        {results}
      </div>
    );
  },
}));
