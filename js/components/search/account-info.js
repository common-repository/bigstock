/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import assign from 'lodash/object/assign';
import utils from './../../lib/utils';
import dispatcher from './../../lib/dispatcher';
import actions from './../../lib/actions';
import colors from './../../lib/colors';

export default React.createClass({

  // Import user context
  propTypes: {
    user: React.PropTypes.object.isRequired,
    vw: React.PropTypes.number.isRequired,
  },

  logout() {
    dispatcher.dispatch({
      type: actions.LOGOUT_USER,
    });
  },

  render() {
    const styles = {
      info: {
        float: 'right',
        marginRight: '10px',
      },

      p: {
        fontSize: '14px',
      },

      logout: {
        color: colors.blue,
      },

      shown: {
        display: 'initial',
      },

      hide: {
        display: 'none',
      },
    };

    // Show and hide text based on VW
    if (this.props.vw <= 768) {
      assign(styles.shown, styles.hide);
    }

    let subscriptionText = (
      <span>
        <strong><span style={styles.shown}>Downloads:</span></strong> {this.props.user.remaining_credits}/{this.props.user.total_credits} <span style={styles.shown}>remaining</span>
      </span>
    );

    if (this.props.user.total_credits === 0) {
      subscriptionText = (
        <span>
          <strong><a href="https://www.bigstockphoto.com/subscribe/" target="_blank">Purchase a subscription to download</a></strong>
        </span>
      );
    }
    return (
      <div style={styles.info}>
        <p style={styles.p}>
        <span style={styles.shown}>Welcome, {utils.capitalizeFirstLetter(this.props.user.first_name)}</span> (
          {subscriptionText}
        ) <a style={styles.logout} onClick={this.logout} href="#logout">Logout</a></p>
      </div>
    );
  },
});
