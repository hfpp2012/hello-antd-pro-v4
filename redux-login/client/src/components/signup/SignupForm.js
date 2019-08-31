import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class SignupForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
      isLoading: false,
      invalid: false
    }
  }

  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    userSignupRequest: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired,
    isUserExists: PropTypes.func.isRequired
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ errors: {}, isLoading: true });
    this.props.userSignupRequest(this.state).then(
      () => {
        this.props.addFlashMessage({
          type: "success",
          text: "You signed up successfully. welcome"
        })
        this.context.router.history.push('/');
      },
      ({ response }) => { this.setState({ errors: response.data, isLoading: false }) }
    );
  }

  checkUserExists = (e) => {
    const field = e.target.name;
    const val = e.target.value;
    if (val !== '') {
      this.props.isUserExists(val).then(res => {
        let errors = this.state.errors;
        let invalid;
        if (res.data.user) {
          errors[field] = "There is user with such " + field;
          invalid = true;
        } else {
          errors[field] = '';
          invalid = false
        }

        this.setState({ errors, invalid });
      });
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <form onSubmit={ this.onSubmit }>
        <h1>Join our community!</h1>

        <div className="form-group">
          <label className="control-label">Username</label>

          <input
            value={ this.state.username }
            onChange={ this.onChange }
            type="text"
            name="username"
            onBlur={ this.checkUserExists }
            className={ classnames('form-control', { 'is-invalid': errors.username }) }
          />
          { errors.username && <span className='form-text text-muted'>{ errors.username }</span> }
        </div>

        <div className="form-group">
          <label className="control-label">Email</label>

          <input
            value={ this.state.email }
            onChange={ this.onChange }
            type="email"
            name="email"
            onBlur={ this.checkUserExists }
            className={ classnames('form-control', { 'is-invalid': errors.email }) }
          />
          { errors.email && <span className='form-text text-muted'>{ errors.email }</span> }
        </div>

        <div className="form-group">
          <label className="control-label">Password</label>

          <input
            value={ this.state.password }
            onChange={ this.onChange }
            type="password"
            name="password"
            className={ classnames('form-control', { 'is-invalid': errors.password }) }
          />
          { errors.password && <span className='form-text text-muted'>{ errors.password }</span> }
        </div>

        <div className="form-group">
          <label className="control-label">Password Confirmation</label>

          <input
            value={ this.state.passwordConfirmation }
            onChange={ this.onChange }
            type="password"
            name="passwordConfirmation"
            className={ classnames('form-control', { 'is-invalid': errors.passwordConfirmation }) }
          />
          { errors.passwordConfirmation && <span className='form-text text-muted'>{ errors.passwordConfirmation }</span> }
        </div>

        <div className="form-group">
          <button disabled={ this.state.isLoading || this.state.invalid } className="btn btn-primary btn-lg">
            Sign up
          </button>
        </div>
      </form>
    );
  }
}

export default SignupForm;
