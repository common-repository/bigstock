/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import radium from 'radium';
import bind from 'lodash/function/bind';
import assign from 'lodash/object/assign';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import dispatcher from './../../lib/dispatcher';
import actions from './../../lib/actions';
import LoginStore from './../../stores/login';
import colors from './../../lib/colors';

export default radium(React.createClass({

  propTypes: {
    vw: React.PropTypes.number.isRequired,
  },

  getInitialState() {
    return {
      errors: LoginStore.getErrors(),
      email: null,
      password: null,
    };
  },

  componentWillMount() {
    this.boundUpdate = bind(this.update, this);
  },

  componentDidMount() {
    LoginStore.addChangeListener(this.boundUpdate);
  },

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.boundUpdate);
  },

  update() {
    this.setState({
      errors: LoginStore.getErrors(),
    });
  },

  updateEmail(e) {
    this.setState({
      email: e.target.value,
    });
  },

  updatePassword(e) {
    this.setState({
      password: e.target.value,
    });
  },

  login(e) {
    e.preventDefault();
    dispatcher.dispatch({
      type: actions.REFRESH_USER_LOGIN,
      email: this.state.email,
      password: this.state.password,
    });
  },

  render() {
    const error = (this.state.errors.length) ? 'Invalid email and/or password' : null;
    const styles = {
      gridHead: {
        backgroundColor: colors.blue,
        padding: '5px',
        textAlign: 'center',
      },

      gridBody: {
        padding: '40px',
      },

      gridBodyMedium: {
        padding: '95px 40px 57px',
      },

      gridBodyLarge: {
        padding: '40px',
      },

      gridFormTiny: {
        margin: '250px 0 50px 0',
      },

      gridFormSmall: {
        margin: '550px 0 50px 0',
      },

      gridFormMedium: {
        margin: '50px',
      },

      gridFormLarge: {
        margin: '0 20px',
        borderRadius: '2px',
        backgroundColor: colors.transparentWhite,
        minHeight: '445px',
      },

      gridFormTitle: {
        color: colors.white,
        fontSize: '22px',
        fontWeight: '400',
      },

      gridFormInput: {
        boxShadow: 'none',
      },

      gridFormInputUnderline: {
        borderColor: colors.blue,
      },

      gridFormInputLabel: {
        color: colors.blue,
      },

      textField: {
        height: '86px',
      },

      gridFormCheckBoxColor: {
        fill: colors.blue,
      },

      button: {
        display: 'block',
        margin: '57px auto 10px auto',
        width: '50%',
        backgroundColor: colors.blue,
        color: colors.white,
        padding: '14px 18px',
        fontSize: '18px',
        borderRadius: '2px',
        border: '0',
        ':hover': {
          opacity: '0.8',
          cursor: 'pointer',
        },
      },

      error: {
        color: colors.red,
      },
    };

    // Create styles based on vw prop
    if (this.props.vw <= 500) {
      styles.gridForm = styles.gridFormTiny;
    } else if (this.props.vw < 768) {
      styles.gridForm = assign(styles.gridFormTiny, styles.gridFormSmall);
    } else if (this.props.vw < 992) {
      styles.gridForm = assign(styles.gridFormTiny, styles.gridFormMedium);
    } else if (this.props.vw < 1200) {
      styles.gridForm = assign(styles.gridFormTiny, styles.gridFormLarge);
      styles.gridBody = assign(styles.gridBody, styles.gridBodyMedium);
    } else {
      styles.gridForm = assign(styles.gridFormTiny, styles.gridFormLarge);
      styles.gridBody = assign(styles.gridBody, styles.gridBodyLarge);
    }

    return (
      <Paper zDepth={0} style={styles.gridForm}>
        <div style={styles.gridHead}>
          <h2 style={styles.gridFormTitle}>Sign in to Bigstock</h2>
        </div>
        <div style={styles.gridBody}>
          <form onSubmit={bind(this.login, this)}>
            <TextField
              inputStyle={styles.gridFormInput}
              floatingLabelStyle={styles.gridFormInputLabel}
              underlineFocusStyle={styles.gridFormInputUnderline}
              floatingLabelText="Email"
              errorStyle={styles.error}
              fullWidth
              errorText={error}
              onChange={bind(this.updateEmail, this)}
              style={styles.textField}
            />
            <TextField
              inputStyle={styles.gridFormInput}
              floatingLabelStyle={styles.gridFormInputLabel}
              underlineFocusStyle={styles.gridFormInputUnderline}
              floatingLabelText="Password"
              errorStyle={styles.error}
              type="password"
              fullWidth
              errorText={error}
              onChange={bind(this.updatePassword, this)}
              style={styles.textField}
            />
            <button style={styles.button} type="submit">
              Sign in
            </button>
          </form>
        </div>
      </Paper>
    );
  },

}));
