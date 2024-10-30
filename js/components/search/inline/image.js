/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';

export default React.createClass({
  propTypes: {
    detail: React.PropTypes.object.isRequired,
  },

  render() {
    const styles = {
      bspInlineImageContainer: {
        float: 'left',
        width: '50%',
      },

      bspInlineOverflow: {
        overflow: 'hidden',
        height: `${this.props.detail.preview.height - 20}px`,
        width: `${this.props.detail.preview.width}px`,
        maxWidth: '100%',
      },

      bspInlineImage: {
        display: 'block',
        margin: '0 auto',
        width: 'auto',
        maxWidth: '100%',
      },
    };

    return (
      <div style={styles.bspInlineImageContainer}>
        <div style={styles.bspInlineOverflow}>
          <img style={styles.bspInlineImage} src={this.props.detail.preview.url} />
        </div>
      </div>
    );
  },
});
