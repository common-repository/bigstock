/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import radium from 'radium';
import debounce from 'lodash/function/debounce';
import bind from 'lodash/function/bind';
import dispatcher from './../../lib/dispatcher';
import actions from './../../lib/actions';
import colors from './../../lib/colors';

export default radium(React.createClass({

  propTypes: {
    query: React.PropTypes.string,
    facets: React.PropTypes.object.isRequired,
    hasNext: React.PropTypes.bool.isRequired,
    hasPrevious: React.PropTypes.bool.isRequired,
  },

  handleClick(num) {
    // Don't let people request page -1
    if (this.props.facets.page + num > 0) {
      // Paginate!
      dispatcher.dispatch({
        type: actions.REFRESH_SEARCH_FACET,
        facet: 'page',
        value: (this.props.facets.page + num),
      });

      dispatcher.dispatch({
        type: actions.REFRESH_SEARCH,
        query: this.props.query,
        facets: this.props.facets,
      });
    }
  },

  render() {
    const styles = {
      divider: {
        color: colors.lightGray,
        margin: '0 5px',
      },

      icon: {
        fontSize: '14px',
        verticalAlign: 'middle',
      },

      paginationLinks: {
        verticalAlign: 'middle',
        color: colors.darkGray,
        display: 'inline-block',
        margin: '0 8px',
        fontSize: '14px',
        ':hover': {
          color: colors.gray,
          cursor: 'pointer',
        },
      },
    };

    const previousLink = this.props.hasPrevious ?
      <a key="previous" style={styles.paginationLinks} onClick={debounce(bind(this.handleClick, this, -1), 400)}><i style={styles.icon} className="material-icons">keyboard_arrow_left</i> Previous</a> :
      null;

    const nextLink = this.props.hasNext ?
      <a key="next" style={styles.paginationLinks} onClick={debounce(bind(this.handleClick, this, 1), 400)}>Next <i style={styles.icon} className="material-icons">keyboard_arrow_right</i></a> :
      null;

    const divider = (this.props.hasNext && this.props.hasPrevious) ?
      <span style={styles.divider}>|</span> :
      null;

    return (
      <div>
        {previousLink}
        {divider}
        {nextLink}
      </div>
    );
  },
}));
