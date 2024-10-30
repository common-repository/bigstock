/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import bind from 'lodash/function/bind';
import radium from 'radium';
import colors from './../../../lib/colors';
import dispatcher from './../../../lib/dispatcher';
import actions from './../../../lib/actions';
import utils from './../../../lib/utils';

export default radium(React.createClass({

  propTypes: {
    detail: React.PropTypes.object.isRequired,
    similar: React.PropTypes.array.isRequired,
  },

  onClick(id) {
    dispatcher.dispatch({
      type: actions.REFRESH_PIC_DETAIL,
      id,
      swap: true,
    });

    // Realign inline details
    utils.scrollInline();
  },

  render() {
    const styles = {
      bspInlineSimilar: {
        float: 'left',
        width: '100%',
        marginTop: '10px',
      },

      bspInlineSimilarTitle: {
        color: colors.white,
      },

      bspInlineSimilarImage: {
        display: 'inline-block',
        verticalAlign: 'middle',
        maxWidth: '15.66666%',
        maxHeight: '100%',
        marginRight: '1%',
        width: 'auto',
        height: 'auto',
        ':hover': {
          cursor: 'pointer',
        },
      },
    };

    // Only take the first 6 related images
    const slicedSimilarImages = this.props.similar.slice(0, 6);

    // Map each image to it's own markup
    const similarImages = slicedSimilarImages.map((similarImage) => {
      return (
        <img key={similarImage.id} src={similarImage.thumbs.small.url} style={styles.bspInlineSimilarImage} onClick={bind(this.onClick, this, similarImage.id)} />
      );
    });

    return (
      <div style={styles.bspInlineSimilar}>
        <h2 style={styles.bspInlineSimilarTitle}>Similar Images</h2>
        {similarImages}
      </div>
    );
  },
}));
