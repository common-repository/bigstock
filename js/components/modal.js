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
import { Motion, spring } from 'react-motion';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';
import colors from './../lib/colors';
import dispatcher from './../lib/dispatcher';
import actions from './../lib/actions';

export default radium(React.createClass({

  propTypes: {
    message: React.PropTypes.object,
    level: React.PropTypes.string,
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string,
    confirm: React.PropTypes.func,
    confirmText: React.PropTypes.string,
    hideReject: React.PropTypes.bool,
    reject: React.PropTypes.bool,
    rejectText: React.PropTypes.string,
    icon: React.PropTypes.string,
    title: React.PropTypes.string,
    tosAgree: React.PropTypes.bool,
    checkTos: React.PropTypes.bool,
    checkFeatured: React.PropTypes.bool,
    hasSub: React.PropTypes.bool,
  },

  setFeaturedImage() {
    dispatcher.dispatch({
      type: actions.SET_FEATURED_IMAGE,
    });
  },

  dismissMessage() {
    dispatcher.dispatch({
      type: actions.DISMISS_MODAL,
      id: this.props.id,
    });

    // If we were checking TOS and they close the modal, make sure they still
    // haven't 'agreed' to the TOS (this is just for the BigstockStore)
    if (this.props.hasSub && this.props.checkTos && this.props.tosAgree) {
      dispatcher.dispatch({
        type: actions.UPDATE_TOS_AGREEMENT,
        tosAgreement: false,
      });
    }
  },

  updateTosAgreement(bool) {
    dispatcher.dispatch({
      type: actions.UPDATE_TOS_AGREEMENT,
      tosAgreement: bool,
    });
  },

  render() {
    const styles = {
      modal: {
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        zIndex: '9999',
        maxWidth: '380px',
      },

      modalBg: {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        zIndex: '9998',
        backgroundColor: colors.transparentBlack,
      },

      modalContainer: {
        width: '100%',
        height: '100%',
      },

      modalHeader: {
        backgroundColor: colors.green,
        padding: '25px',
        textAlign: 'center',
        margin: '0 0 -57px 0',
      },

      modalTitle: {
        display: 'inline-block',
        color: colors.white,
        fontSize: '22px',
        margin: '0',
      },

      modalBody: {
        margin: '0',
        padding: '30px',
        textAlign: 'center',
        backgroundColor: colors.white,
      },

      modalText: {
        margin: '0',
        fontSize: '14px',
      },

      dismissIcon: {
        position: 'absolute',
        right: '5px',
        top: '10px',
        color: colors.white,
        fontSize: '30px',
      },

      confirmButton: {
        boxShadow: 'none',
        marginTop: '20px',
        fontSize: '18px',
        padding: '14px 18px',
        color: colors.offWhite,
        border: '0',
        borderRadius: '2px',
        backgroundColor: colors.blue,
        textTransform: 'none',
      },

      confirmButtonDisabled: {
        backgroundColor: colors.gray,
      },

      icon: {
        marginTop: '20px',
        fontSize: '48px',
        color: colors.blue,
        backgroundColor: colors.white,
        padding: '10px',
        borderRadius: '50%',
      },

      error: {
        backgroundColor: colors.red,
      },

      info: {
        backgroundColor: colors.blue,
      },

      modalCheckbox: {
        display: 'inline-block',
        width: 'auto',
        outline: `1px solid ${colors.blue}`,
      },

      checkboxLabel: {
        display: 'inline-block',
        maxWidth: '90%',
        marginLeft: '10px',
      },
    };

    // Change button color when disabled
    if (this.props.hasSub && this.props.checkTos && !this.props.tosAgree) {
      assign(styles.confirmButton, styles.confirmButtonDisabled);
    }

    switch (this.props.level) {
      case 'error':
        assign(styles.modalHeader, styles.error);
        assign(styles.confirmButton, styles.error);
        assign(styles.icon, { color: colors.red });
        break;
      case 'info':
        assign(styles.modalHeader, styles.info);
        break;
      default:
        // Nothing to do
        break;
    }

    const featuredCheckbox = this.props.checkFeatured ?
      <div>
        <input
          type="checkbox"
          name="featured"
          value="1"
          style={styles.modalCheckbox}
          onClick={bind(this.setFeaturedImage, this)}
        />
        <p style={styles.checkboxLabel}>Set as Featured Image</p>
      </div> :
      null;

    const tosCheckbox = this.props.checkTos ?
      <div>
        <input
          type="checkbox"
          name="Standard Agreement"
          value="tos"
          checked={this.props.tosAgree}
          style={styles.modalCheckbox}
          onClick={bind(this.updateTosAgreement, this, !this.props.tosAgree)}
        />
        <p style={styles.checkboxLabel}>I agree to the <a href="http://www.bigstockphoto.com/usage.html" target="_blank">Standard Agreement</a>.</p>
      </div> :
      null;

    let confirmButton = null;
    let rejectButton = null;
    if (this.props.type === 'confirm') {
      const confirmAction = () => {
        if (this.props.confirm) {
          this.props.confirm();
        }
        this.dismissMessage();
      };
      const confirmText = (this.props.confirmText) ? this.props.confirmText : 'Confirm';
      confirmButton = (
        <button style={styles.confirmButton} disabled={this.props.hasSub && this.props.checkTos && !this.props.tosAgree} className="confirm-button" onClick={confirmAction}>{confirmText}</button>
      );

      if (!this.props.hideReject) {
        const rejectAction = (this.props.reject) ? this.props.reject : this.dismissMessage;
        const rejectText = (this.props.rejectText) ? this.props.rejectText : 'Cancel';
        rejectButton = <RaisedButton label={rejectText} primary onClick={rejectAction} />;
      }
    }

    return (
      <Motion defaultStyle={ { x: 0.5 } } style={ { x: spring(1, [400, 40]) } } >
        {interpolatedStyle => (
            <div style={styles.modalBg}>
              <div style={assign({ zoom: interpolatedStyle.x, opacity: interpolatedStyle.x }, styles.modal)}>
                <div style={styles.modalHeader}>
                  <i className="material-icons" style={styles.icon}>{this.props.icon}</i>
                  <a href="#close">
                    <FontIcon
                      style={styles.dismissIcon}
                      className="material-icons"
                      hoverColor={colors.white}
                      onClick={this.dismissMessage}
                    >
                      &#xE888;
                    </FontIcon>
                  </a>
                </div>
                <div style={styles.modalBody}>
                  <h1>{this.props.title}</h1>
                  <p style={styles.modalText}>{this.props.message}</p>
                  {tosCheckbox}
                  {featuredCheckbox}
                  {confirmButton}
                  {rejectButton}
                </div>
              </div>
            </div>
        )}
      </Motion>
    );
  },
}));
