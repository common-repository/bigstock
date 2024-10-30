/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import assign from 'lodash/object/assign';
import colors from './../lib/colors';
import postcss from '../lib/postcss';
import LoginForm from './login/login';
import RegisterForm from './login/register';

export default React.createClass({

  propTypes: {
    vw: React.PropTypes.number.isRequired,
  },

  getBackgroundUrl(bg) {
    const opts = bigstockphoto || {};
    return `${opts.pluginUrl}/img/backgrounds/${bg}`;
  },

  randomBackground(backgrounds) {
    const len = backgrounds.length;
    const idx = Math.floor(Math.random() * len);
    return backgrounds[idx];
  },

  backgrounds: [
    'bigstock-Castle-Mountain-in-Banff-Natio-99088364.png',
  ],

  render() {
    const bg = this.getBackgroundUrl(this.randomBackground(this.backgrounds));
    const styles = postcss({
      bspBg: {
        height: '100%',
        width: '100%',
        backgroundSize: '100% 100%',
        backgroundImage: `url('${bg}')`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },

      bspBgSmall: {
        overflow: 'scroll',
      },

      bspBgMedium: {
        overflow: 'scroll',
      },

      bspBgLarge: {
        paddingTop: '100px',
        overflow: 'scroll',
      },

      bspBgHuge: {
        paddingTop: '20px',
      },

      bspTitle: {
        width: '100%',
        maxWidth: '920px',
        textShadow: `1px 1px 1px ${colors.transparentWhite}`,
        fontSize: '32px',
        lineHeight: '38px',
        color: colors.black,
        margin: '0 auto 20px auto',
        display: 'block',
        textAlign: 'center',
        fontWeight: '400',
      },

      bspGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: '0 auto',
        maxWidth: '920px',
      },

      bspGridCell: {
        flex: '1',
      },

      bspGridCellSmall: {
        flex: '0 0 100%',
      },

      bspGridCellLarge: {
        flex: '1',
      },

      verticalCenter: {
        flex: '1',
      },

      boldText: {
        fontWeight: '800',
        margin: '0 auto 5px auto',
      },
    });

    // adjust styles based on viewport width (992 is iPad, so anything smaller
    // is most likely a tablet or phone)
    if (this.props.vw < 992) {
      assign(styles.bspGridCell, styles.bspGridCellSmall);
      assign(styles.bspBg, styles.bspBgSmall);
    } else if (this.props.vw < 1200) {
      assign(styles.bspGridCell, styles.bspGridCellLarge);
      assign(styles.bspBg, styles.bspBgLarge);
    } else {
      assign(styles.bspBg, styles.bspBgHuge);
    }

    return (
      <div style={styles.bspBg}>
        <div style={styles.verticalCenter}>
          <h1 style={assign({}, styles.bspTitle, styles.boldText)}>
            Need images for your posts?
          </h1>
          <h1 style={styles.bspTitle}>
            Bigstock offers more than 33 million royalty-free images.
          </h1>

          <div style={styles.bspGrid}>
            <div style={styles.bspGridCell}>
              <LoginForm vw={this.props.vw} />
            </div>
            <div style={styles.bspGridCell}>
              <RegisterForm vw={this.props.vw} />
            </div>
          </div>
        </div>
      </div>
    );
  },

});
