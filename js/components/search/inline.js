/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import bind from 'lodash/function/bind';
import assign from 'lodash/object/assign';
import FontIcon from 'material-ui/lib/font-icon';
import InlineImage from './inline/image';
import InlineDetail from './inline/details';
import InlineSimilar from './inline/similar';
import postcss from './../../lib/postcss';
import utils from './../../lib/utils';
import dispatcher from './../../lib/dispatcher';
import actions from './../../lib/actions';
import colors from './../../lib/colors';

export default React.createClass({

  propTypes: {
    detail: React.PropTypes.object.isRequired,
    licenses: React.PropTypes.array,
    downloading: React.PropTypes.bool.isRequired,
    setFeatured: React.PropTypes.bool.isRequired,
    similar: React.PropTypes.array,
    vw: React.PropTypes.number.isRequired,
    facets: React.PropTypes.object.isRequired,
  },

  componentDidMount() {
    // Expand Inline and scroll to it
    utils.expandInline();
  },

  closeInline() {
    dispatcher.dispatch({
      type: actions.CLOSE_PIC_DETAIL,
    });
  },

  render() {
    const styles = postcss({
      bspInline: {
        backgroundColor: colors.darkGray,
        width: '100%',
        padding: '0',
        maxHeight: '0',
        overflow: 'hidden',
        transition: 'max-height 0.15s',
        position: 'relative',
      },

      bspInlineContainer: {
        display: 'block',
        width: '100%',
        margin: '0 auto',
      },

      bspInlineContainerTablet: {
        width: '90%',
      },

      bspInlineContainerDesktop: {
        width: '80%',
      },

      bspInlineContainerFull: {
        width: '60%',
      },

      closeInlineLink: {
        position: 'absolute',
        top: '10px',
        right: '10px',
      },

      closeInlineIcon: {
        color: colors.whiteSmoke,
      },
    });

    // Adjust based on VW
    if (this.props.vw >= 992 && this.props.vw < 1200) {
      assign(styles.bspInlineContainer, styles.bspInlineContainerTablet);
    } else if (this.props.vw >= 1200 && this.props.vw < 1600) {
      assign(styles.bspInlineContainer, styles.bspInlineContainerDesktop);
    } else if (this.props.vw >= 1600) {
      assign(styles.bspInlineContainer, styles.bspInlineContainerFull);
    }

    const similarImages = (this.props.similar) ?
      <InlineSimilar detail={this.props.detail} similar={this.props.similar} /> :
      null;

    return (
      <div className="bspInline" style={styles.bspInline}>
        <div className="bspInlineContainer" style={styles.bspInlineContainer}>

          <a onClick={bind(this.closeInline, this)} style={styles.closeInlineLink} href="#close">
            <FontIcon style={styles.closeInlineIcon} className="material-icons" hoverColor={colors.blue}>
              &#xE14C;
            </FontIcon>
          </a>

          <InlineImage detail={this.props.detail} />

          <InlineDetail
            setFeatured={this.props.setFeatured}
            licenses={this.props.licenses}
            detail={this.props.detail}
            downloading={this.props.downloading}
            facets={this.props.facets}
          />

          {similarImages}

        </div>
      </div>
    );
  },
});
