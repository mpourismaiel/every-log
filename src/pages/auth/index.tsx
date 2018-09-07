import * as React from 'react';
import classNames from 'classnames';
import { Container, Col, Row } from 'reactstrap';

import './styles.scss';
import { API, setToken } from '../../utils/request';
import history from '../../history';
import Link from '../../components/link';
import { EyeOff, Eye, Loader } from 'react-feather';

export interface IAuthProps {
  location: Location;
}

export interface IAuthState {
  height: number;
  email: string;
  error: {
    message?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
  };
  isLoggingIn: boolean;
  isRegistering: boolean;
  loginForm: boolean;
  password: string;
  passwordConfirm: string;
  passwordShow: boolean;
}

class Auth extends React.Component<IAuthProps, IAuthState> {
  state: IAuthState = {
    email: '',
    error: {},
    height: 600,
    isLoggingIn: false,
    isRegistering: false,
    loginForm: /^\/login/.test(this.props.location.pathname),
    password: '',
    passwordConfirm: '',
    passwordShow: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentDidUpdate(prevProps: IAuthProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({
        loginForm: /^\/login/.test(this.props.location.pathname),
        password: '',
        passwordConfirm: '',
        error: {},
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => this.setState({ height: window.innerHeight });

  togglePassword = () =>
    this.setState({ passwordShow: !this.state.passwordShow });

  handleChange = (key: 'email' | 'password' | 'passwordConfirm') => e => {
    this.setState({ [key]: e.target.value } as any, () => {
      this.setState({ error: { ...this.state.error, ...this.validate() } });
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const error = this.validate();
    if (!!Object.keys(error).find(key => !!error[key])) {
      this.setState({ error });
      return;
    }

    if (this.state.loginForm) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  };

  render() {
    return (
      <Container
        className="viewport auth"
        style={{ height: this.state.height }}>
        <div className="background" />
        <Col className="form-container">
          <div className="empty" />
          <h1 className="logo">EveryLog</h1>
          <form onSubmit={this.handleLogin}>
            <Row className="mx-0">
              <input
                className={classNames({
                  'has-error': !!this.state.error.email,
                })}
                type="email"
                placeholder="Email"
                value={this.state.email}
                onInput={this.handleChange('email')}
              />
            </Row>
            {!!this.state.error.email && (
              <small className="pl-2 error text-danger">
                {this.state.error.email}
              </small>
            )}
            <Row className="mx-0 position-relative">
              <input
                className={classNames({
                  'has-error': !!this.state.error.password,
                })}
                type={this.state.passwordShow ? 'text' : 'password'}
                placeholder="Password"
                value={this.state.password}
                onInput={this.handleChange('password')}
              />
              {!!this.state.password && (
                <span
                  className="position-absolute show"
                  onClick={this.togglePassword}>
                  {this.state.passwordShow ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </span>
              )}
            </Row>
            {!!this.state.error.password && (
              <small className="pl-2 error text-danger">
                {this.state.error.password}
              </small>
            )}
            {!this.state.loginForm && (
              <>
                <Row className="mx-0">
                  <input
                    className={classNames({
                      'has-error': !!this.state.error.passwordConfirm,
                    })}
                    type="password"
                    placeholder="Confirm your password"
                    value={this.state.passwordConfirm}
                    onInput={this.handleChange('passwordConfirm')}
                  />
                </Row>
                {!!this.state.error.passwordConfirm && (
                  <small className="pl-2 error text-danger">
                    {this.state.error.passwordConfirm}
                  </small>
                )}
              </>
            )}
            {!!this.state.error.message && (
              <Row className="pl-2 mx-0 error text-danger">
                {this.state.error.message}
              </Row>
            )}
            <button
              disabled={
                this.state.isLoggingIn ||
                this.state.isRegistering ||
                !this.state.email ||
                this.state.password.length < 8 ||
                (!this.state.loginForm &&
                  this.state.password !== this.state.passwordConfirm)
              }
              className={classNames('mt-2', {
                loading: this.state.isLoggingIn,
              })}
              onClick={this.handleSubmit}>
              {this.state.isLoggingIn ? (
                <Loader />
              ) : this.state.loginForm ? (
                'Login'
              ) : (
                'Register'
              )}
            </button>
            <Row className="justify-content-between">
              <Col className="text-right" xs="auto">
                {this.state.loginForm ? (
                  <Link className="p-2 d-block" href="/register">
                    Create an account
                  </Link>
                ) : (
                  <Link className="p-2 d-block" href="/login">
                    Have an account?
                  </Link>
                )}
              </Col>
              <Col xs="auto">
                <Link className="p-2 d-block" href="/" onClick={this.skipAuth}>
                  Skip to app
                </Link>
              </Col>
            </Row>
          </form>
        </Col>
      </Container>
    );
  }

  private skipAuth = e => {
    e.preventDefault();
    localStorage.setItem('isUsingAuth', 'false');
  };

  private validate = () => {
    const { email, loginForm, password, passwordConfirm } = this.state;
    const error: any = {};
    if (!!email) {
      error.email = null;
    } else {
      error.email = 'Please enter your email address';
    }

    if (!password) {
      error.password = 'Please enter your password';
    } else if (password.length < 8) {
      error.password = 'Password must be at least 8 characters';
    } else {
      error.password = null;
    }

    if (!loginForm) {
      if (!passwordConfirm) {
        error.passwordConfirm = 'Please confirm your password';
      } else if (passwordConfirm !== password) {
        error.passwordConfirm = 'Passwords do not match';
      } else {
        error.passwordConfirm = null;
      }
    }

    return error;
  };

  private handleLogin = () => {
    const { email, password } = this.state;

    this.setState({ isLoggingIn: true });
    API.login({ email, password })
      .then(response => {
        this.setState({
          email: '',
          error: {},
          password: '',
          isLoggingIn: false,
        });
        setToken(response.data.token);
        history.push({
          pathname: '/',
        });
      })
      .catch(err =>
        this.setState({
          error: { message: err.response.data.error },
          password: '',
          passwordConfirm: '',
          isLoggingIn: false,
        }),
      );
  };

  private resetForm = () =>
    this.setState({
      email: '',
      error: {},
      password: '',
      isRegistering: false,
    });

  private handleRegister = () => {
    const { email, password, passwordConfirm } = this.state;
    this.setState({ isRegistering: true });
    API.register({ email, password, passwordConfirm })
      .then(response => {
        setToken(response.data.token);
        const transactions = JSON.parse(localStorage.getItem('transactions'));
        if (transactions) {
          const upload = confirm(
            'Do you want to upload your previous transactions? If not previous transactions will be deleted.',
          );
          if (upload) {
            API.importTransactions(
              Object.keys(transactions).map(key => transactions[key]),
            ).then(() => {
              this.resetForm();
              history.push({
                pathname: '/',
              });
            });
          } else {
            this.resetForm();
            history.push({
              pathname: '/',
            });
          }
        }
      })
      .catch(err => {
        this.setState({
          error: { message: err.response.data.error },
          password: '',
          passwordConfirm: '',
          isRegistering: false,
        });
      });
  };
}

export default Auth;
