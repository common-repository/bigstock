/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import radium from 'radium';
import assign from 'lodash/object/assign';
import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import colors from './../../lib/colors';

export default radium(React.createClass({

  propTypes: {
    vw: React.PropTypes.number.isRequired,
  },

  render() {
    const styles = {
      gridHead: {
        backgroundColor: colors.blue,
        padding: '5px',
        textAlign: 'center',
      },

      gridBody: {
        padding: '30px 40px 40px 40px',
      },

      gridFormSmall: {
        margin: '0 0 50px 0',
      },

      gridFormMedium: {
        margin: '0 50px 50px',
      },

      gridFormLarge: {
        marginRight: '20px',
        borderRadius: '2px',
        backgroundColor: colors.transparentWhite,
        minHeight: '445px',
      },

      gridFormTitle: {
        color: colors.white,
        fontWeight: '400',
        fontSize: '22px',
      },

      gridFormLI: {
        display: 'inline-block',
        margin: '25px 0 0',
        fontSize: '14px',
        width: '33%',
      },

      gridFormIcon: {
        display: 'block',
        textAlign: 'center',
        marginRight: '5px',
        fontSize: '50px',
      },

      iconCaption: {
        textTransform: 'uppercase',
        fontSize: '11px',
        lineHeight: '17px',
        color: colors.black,
        textAlign: 'center',
      },

      iconCaptionLarge: {
        fontSize: '14px',
      },

      button: {
        display: 'block',
        margin: '20px auto 10px auto',
        width: '50%',
        backgroundColor: colors.blue,
        color: colors.white,
        padding: '14px 18px',
        textDecoration: 'none',
        textAlign: 'center',
        fontSize: '18px',
        borderRadius: '2px',
        border: '0',
        ':hover': {
          opacity: '0.8',
          cursor: 'pointer',
        },
      },

      gridFormFlavor: {
        textAlign: 'center',
        fontWeight: '800',
        color: colors.black,
        fontSize: '22',
        marginTop: '0',
      },

      gridFormFlavorSub: {
        textAlign: 'center',
        fontWeight: '400',
        color: colors.black,
        fontSize: '22',
        margin: '10px',
        lineHeight: '30px',
      },
    };

    // Create styles based on vw prop
    if (this.props.vw < 768) {
      styles.gridForm = styles.gridFormSmall;
    } else if (this.props.vw < 992) {
      styles.gridForm = assign(styles.gridFormSmall, styles.gridFormMedium);
    } else if (this.props.vw < 1200) {
      styles.gridForm = assign(styles.gridFormSmall, styles.gridFormLarge);
    } else {
      styles.gridForm = assign(styles.gridFormSmall, styles.gridFormLarge);
      styles.iconCaption = assign(styles.iconCaption, styles.iconCaptionLarge);
    }

    return (
      <Paper style={styles.gridForm} zDepth={0}>
        <div style={styles.gridHead}>
          <h2 style={styles.gridFormTitle}>New to Bigstock?</h2>
        </div>
        <div style={styles.gridBody}>
          <h3 style={styles.gridFormFlavor}>Try Bigstock free for 7 days.</h3>
          <h4 style={styles.gridFormFlavorSub}>Get up to 35 royalty-free images.</h4>
          <ul style={styles.gridFormUL}>
            <li style={styles.gridFormLI}>
              <FontIcon style={styles.gridFormIcon} className="material-icons">collections</FontIcon>
              <p style={styles.iconCaption}>An Amazing Collection</p>
            </li>
            <li style={styles.gridFormLI}>
              <FontIcon style={styles.gridFormIcon} className="material-icons">sentiment_very_satisfied</FontIcon>
              <p style={styles.iconCaption}>Easy Upfront Pricing</p>
            </li>
            <li style={styles.gridFormLI}>
              <FontIcon style={styles.gridFormIcon} className="material-icons">chat</FontIcon>
              <p style={styles.iconCaption}>Ask Us Anything</p>
            </li>
          </ul>
          <a target="_blank" style={styles.button} href="http://www.bigstockphoto.com/free-trial?pl=BSWPV1">Start Your Free Trial</a>
        </div>
      </Paper>
    );
  },
}));
