/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import bind from 'lodash/function/bind';
import BigstockStore from './../stores/bigstock';
import MessageStore from './../stores/message';

/** Components */
import Modal from './modal';

/** Screens */
import Search from './search';
import Login from './login';

export default React.createClass({

  // Set user context, allowing all children to access it without threading
  // the data down the component tree
  childContextTypes: {
    user: React.PropTypes.object,
  },

  getInitialState() {
    return {
      token: BigstockStore.getToken(),
      user: BigstockStore.getUser(),
      vw: window.innerWidth,
      modals: MessageStore.getModals(),
    };
  },

  getChildContext() {
    return {
      user: BigstockStore.getUser(),
    };
  },

  componentWillMount() {
    this.boundUpdate = bind(this.update, this);
  },

  componentDidMount() {
    BigstockStore.addChangeListener(this.boundUpdate);
    MessageStore.addChangeListener(this.boundUpdate);
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount() {
    BigstockStore.removeChangeListener(this.boundUpdate);
    MessageStore.removeChangeListener(this.boundUpdate);
    window.removeEventListener('resize', this.handleResize);
  },

  handleResize() {
    this.setState({
      vw: window.innerWidth,
    });
  },

  update() {
    this.setState({
      token: BigstockStore.getToken(),
      user: BigstockStore.getUser(),
      modals: MessageStore.getModals(),
    });
  },

  renderScreen() {
    return (!this.state.token) ?
      <Login vw={this.state.vw} /> :
      <Search vw={this.state.vw} user={this.state.user} token={this.state.token} />;
  },

  render() {
    const styles = {
      bspContainer: {
        height: '100%',
        width: '100%',
        position: 'relative',
      },
    };

    const modals = this.state.modals.map((modal, i) => {
      return (
        <Modal
          id={modal.id}
          key={i}
          type={modal.type}
          level={modal.level}
          confirm={modal.confirm}
          confirmText={modal.confirmText}
          reject={modal.reject}
          rejectText={modal.rejectText}
          title={modal.title}
          hideReject={modal.hideReject}
          icon={modal.icon}
          message={modal.message}
          hasSub={modal.hasSub || false}
          tosAgree={BigstockStore.hasAgreedToTos()}
          checkTos={modal.checkTos || false}
          checkFeatured={modal.checkFeatured || false}
        />
      );
    });


    return (
      <div style={styles.bspContainer} id="bsp-container" >
        {modals}
        {this.renderScreen()}
      </div>
    );
  },

});
