import React, { MouseEvent, ChangeEvent } from 'react';

import styled from 'styled-components';

import SingleLineInput from '../components/SingleLineInput';
import Button from '../components/Button';

import AuthenticationService from '../services/AuthenticationService';

import oneMinuteIconDark from '../assets/images/one-minute-icon-dark.svg';

const LoginScreenContainer = styled.div`
  background-color: #37474F;
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
  color: #FFFFFF;
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
  loginStatus: string;
}

class LoginScreen extends React.Component<
  LogInScreenProps,
  LoginScreenState
> {

  authenticationService: AuthenticationService = new AuthenticationService();

  state = {
    username: '',
    loginStatus: ' '
  }

  handleLogInButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      this.setState({loginStatus: 'Logging in ...'});
      await this.authenticationService.login(
        this.state.username,
        process.env.REACT_APP_MOCK_PASSWORD || ''
      );
      if (AuthenticationService.token) {
        this.props.onLoggedIn();
      }
    } catch (e) {
      if (e.name === "AuthenticationError") {
        if (e.httpStatus === 422) {
          this.setState({loginStatus: 'Please enter a valid e-mail.'});
        } else if (e.httpStatus === 401 || e.httpStatus === 404) {
          this.setState({loginStatus: 'This e-mail is not registered with us.'});
        }
      }
    }
  }

  render() {
    const { loggingInAgain } = this.props;
    const { username, loginStatus } = this.state;
    return (
      <LoginScreenContainer {...(loggingInAgain && {className: 'logging-in-again'})}>
        <LoginAreaContainer autoComplete="off">
          <OneMinuteLoginIcon
            src={oneMinuteIconDark}
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
            label="E-mail Address"
            inputStyle="dark"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
              username: e.target.value})
            }
          />
          <LogInText>
            {loginStatus || ' '}
          </LogInText>
          <LogInButton
            buttonStyle="white-transparent"
            text="Log In"
            onClick={this.handleLogInButtonClick}
          />
        </LoginAreaContainer>
      </LoginScreenContainer>
    )
  }

};

export default LoginScreen;
