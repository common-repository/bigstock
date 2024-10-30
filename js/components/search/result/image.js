/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import bind from 'lodash/function/bind';
import assign from 'lodash/object/assign';
import radium from 'radium';
import dispatcher from './../../../lib/dispatcher';
import actions from './../../../lib/actions';
import colors from './../../../lib/colors';

export default radium(React.createClass({

  propTypes: {
    active: React.PropTypes.bool.isRequired,
    activeStyle: React.PropTypes.bool.isRequired,
    dimensions: React.PropTypes.object.isRequired,
    image: React.PropTypes.object.isRequired,
  },

  onClick(id) {
    if (this.props.activeStyle && this.props.active && id === this.props.image.id) {
      dispatcher.dispatch({
        type: actions.CLOSE_PIC_DETAIL,
      });
    } else {
      dispatcher.dispatch({
        type: actions.REFRESH_PIC_DETAIL,
        id,
      });
      dispatcher.dispatch({
        type: actions.REFRESH_SIMILAR_IMAGES,
        id,
      });
    }
  },

  render() {
    const styles = {
      bspSearchGridCell: {
        flex: 'inherit',
        margin: '0px 0px -17px 0px',
        width: `${this.props.dimensions.containerWidth}px`,
        height: `${this.props.dimensions.containerHeight}px`,
        position: 'relative',
        ':hover': {
          cursor: 'pointer',
        },
      },

      bspSearchGridCellImage: {
        width: `${this.props.dimensions.imageWidth}px`,
        height: `${this.props.dimensions.imageHeight}px`,
        ':hover': {
          opacity: '0.8',
        },
      },

      bspSearchGridCellActive: {
        borderColor: colors.blue,
        ':hover': {
          opacity: '1.0',
        },
      },

      bspSearchGridCellActiveCaret: {
        position: 'absolute',
        bottom: '2',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '0',
        height: '0',
        borderStyle: 'solid',
        borderWidth: '15px 12px 0 12px',
        borderColor: `${colors.blue} transparent transparent transparent`,
      },

      bspSearchGridOverflow: {
        overflow: 'hidden',
        width: `${this.props.dimensions.imageWidth}px`,
        height: `${this.props.dimensions.imageHeight - 17}px`,
        borderStyle: 'solid',
        borderWidth: '3px',
        borderColor: colors.white,
        boxSizing: 'border-box',
      },
    };

    // Extend styles for active image
    if (this.props.active && this.props.activeStyle) {
      assign(styles.bspSearchGridOverflow, styles.bspSearchGridCellActive);
    }

    const caret = this.props.active && this.props.activeStyle ?
      <span style={styles.bspSearchGridCellActiveCaret}></span> :
      null;

    let screen = (<div></div>);
    if (this.props.image) {
      screen = (
        <div style={styles.bspSearchGridCell} key={`${this.props.image.id}-grid-image-container`} onClick={bind(this.onClick, this, this.props.image.id)}>
          <div style={styles.bspSearchGridOverflow}>
            <img src={this.props.image.preview.url} key={`${this.props.image.id}-grid-image`} style={styles.bspSearchGridCellImage}/>
          </div>
          {caret}
        </div>
      );
    }
    return screen;
  },
}));
