import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validateInput from '../../utils/validations/login';
import { login } from '../../actions/authActions';

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      identifier: '',
      password: '',
      errors: {},
      isLoading: false
    }
  }

  static propTypes = {
    login: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  isValid = () => {
    const { errors, isValid } = validateInput(this.state);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.login(this.state).then(
        (res) => this.context.router.history.push('/'),
        (err) => this.setState({ errors: err.response.data.errors, isLoading: false })
      );
    }
  }

  render() {
    const { errors, identifier, password, isLoading } = this.state;
    return (
      <form onSubmit={ this.onSubmit }>
        <h1>Login</h1>

        { errors.form && <div className="alert alert-danger">{ errors.form }</div> }

        <div className="form-group">
          <label className="control-label">Username / Email</label>

          <input
            value={ identifier }
            onChange={ this.onChange }
            type="text"
            name="identifier"
            className={ classnames('form-control', { 'is-invalid': errors.identifier }) }
          />
          { errors.identifier && <span className='form-text text-muted'>{ errors.identifier }</span> }
        </div>

        <div className="form-group">
          <label className="control-label">Password</label>

          <input
            value={ password }
            onChange={ this.onChange }
            type="password"
            name="password"
            className={ classnames('form-control', { 'is-invalid': errors.password }) }
          />
          { errors.password && <span className='form-text text-muted'>{ errors.password }</span> }
        </div>

        <div className="form-group">
          <button disabled={ isLoading } className="btn btn-primary btn-lg">
            Login
          </button>
        </div>
      </form>
    );
  }
}

export default connect(null, { login })(LoginForm);
