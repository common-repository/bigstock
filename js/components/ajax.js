/**
* @package Bigstock
* @version 1.0.0
* @author BigstockPhoto
* @copyright Shutterstock, Inc.
*/

import React from 'react';
import radium from 'radium';
import assign from 'lodash/object/assign';
import colors from './../lib/colors';

export default radium(React.createClass({

  propTypes: {
    message: React.PropTypes.string,
    style: React.PropTypes.object,
  },

  render() {
    const styles = {
      container: {
        width: '100%',
        textAlign: 'center',
      },

      loader: {
        margin: '0 auto',
        width: '50px',
        height: '50px',
        backgroundImage: `url(${bigstockphoto.pluginUrl}/img/loader.gif)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      },

      message: {
        color: colors.gray,
        fontSize: '14px',
        display: 'block',
        margin: '10px auto 0 auto',
      },
    };

    if (this.props.style) {
      styles.container = assign(styles.container, this.props.style);
    }

    let message = null;
    if (this.props.message) {
      message = <span style={styles.message}>{this.props.message}</span>;
    }

    return (
      <div style={styles.container}>
        <div style={styles.loader}></div>
        {message}
      </div>
    );
  },

}));
