import React, { MouseEvent, ChangeEvent } from 'react';

import config from '../config/config.json';

import styled from 'styled-components';

import SingleLineInput from '../components/SingleLineInput';
import Button from '../components/Button';

import AuthenticationService from '../services/AuthenticationService';

const LoginScreenContainer = styled.div`
  background-color: ${config.branding.loginScreenBackground};
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  &.logging-in-again {
    background-color: rgba(40, 40, 40, 0.3);
  }
`;

const LoginAreaContainer = styled.form`
  background-color: #37474F;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0 60px;
  max-width: 275px;
  max-height: 667px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${config.branding.loginScreenTheme === 'dark' ? '#FFFFFF' : 'inherit'};
  @media screen and (max-width: 576px) {
    height: auto;
  }
`;

const OneMinuteLoginIcon = styled.img`
  display: block;
  width: 100px;
  margin-bottom: 30px;
`;

const LogInHeader = styled.h2`
  font-family: 'sf_compact_textmedium';
  margin: 0 20px;
  text-align: center;
`;

const LogInText = styled.p`
  text-align: center;
  min-height: 24px;
`;

const LogInButton = styled(Button)`
  margin: 30px 0;
`;

interface LogInScreenProps {
  onLoggedIn: () => void;
  loggingInAgain?: boolean;
}

interface LoginScreenState {
  username: string;
  password: string;
  loginStatus: string;
  isLoggingIn: boolean;
}

class LoginScreen extends React.Component<
  LogInScreenProps,
  LoginScreenState
> {

  authenticationService: AuthenticationService = new AuthenticationService();

  state = {
    username: '',
    password: config.autoLoginPassword ? String(config.autoLoginPassword) : '',
    loginStatus: '',
    isLoggingIn: false
  }

  handleLogInButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    const { username, password } = this.state;

    try {
      this.setState({
        loginStatus: 'Logging in ...',
        isLoggingIn: true
      });
      await this.authenticationService.login(username, password);
      if (AuthenticationService.token) {
        this.props.onLoggedIn();
      }
    } catch (e) {
      if (e.name === "AuthenticationError") {
        if (e.httpStatus === 422) {
          this.setState({
            loginStatus: 'Please enter a valid e-mail and password.',
            password: ''
          });
        } else if (e.httpStatus === 401 || e.httpStatus === 404) {
          this.setState({
            loginStatus: 'Invalid e-mail or password.',
            password: ''
          });
        }
      }
    } finally {
      this.setState({isLoggingIn: false});
    }

  }

  render() {
    const { loggingInAgain } = this.props;
    const { username, password, loginStatus, isLoggingIn } = this.state;
    return (
      <LoginScreenContainer {...(loggingInAgain && {className: 'logging-in-again'})}>
        <LoginAreaContainer autoComplete="off">
          <OneMinuteLoginIcon
            src={config.branding.loginScreenImageSrc}
            alt="Welcome to the One Minute Story Editor"
          />
          <LogInHeader>
            Log In
            </LogInHeader>
          <LogInText>
            {loggingInAgain && 'Just to confirm that it\'s you, please log in again with your e-mail address.'}
            {!loggingInAgain && 'Please log in with your e-mail address.'}
          </LogInText>
          <SingleLineInput
            type="email"
            label="E-mail Address"
            inputStyle="dark"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
              username: e.target.value})
            }
          />
          {!config.autoLoginPassword &&
            <SingleLineInput
              type="password"
              label="Password"
              inputStyle="dark"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                password: e.target.value})
              }
            />
          }
          <LogInText>
            {loginStatus || ' '}
          </LogInText>
          <LogInButton
            buttonStyle="white-transparent"
            text="Log In"
            disabled={isLoggingIn}
            onClick={this.handleLogInButtonClick}
          />
        </LoginAreaContainer>
      </LoginScreenContainer>
    )
  }

};

export default LoginScreen;
