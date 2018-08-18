import * as React from 'react';

export interface ILoginState {
  email: string;
  password: string;
  passwordConfirm: string;
}

class Login extends React.Component<{}, ILoginState> {
  state: ILoginState = {
    email: '',
    password: '',
    passwordConfirm: '',
  };

  render() {
    return (
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </form>
    );
  }
}

export default Login;
