import React, { ChangeEvent } from 'react';

import styled from 'styled-components';

import SingleLineInput from '../components/SingleLineInput';
import Button from '../components/Button';

import AuthenticationService from '../services/AuthenticationService';

import oneMinuteIconDark from '../assets/images/one-minute-icon-dark.svg';

const LoginScreenContainer = styled.div`
  background-color: #37474f;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginAreaContainer = styled.div`
  width: 100vw;
  height: 100vh;
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
`;

const LogInButton = styled(Button)`
  margin: 30px 0;
`;

interface LogInScreenProps {
  onLoggedIn: () => void;
}

interface LoginScreenState {
  username: string;
}

class LoginScreen extends React.Component<
  LogInScreenProps,
  LoginScreenState
> {

  authenticationService: AuthenticationService = new AuthenticationService();

  state = {
    username: ''
  }

  handleLogInButtonClick = async () => {
    try {
      console.log(this.state.username);
      await this.authenticationService.login(this.state.username, 'gift123');
      if (AuthenticationService.token) {
        this.props.onLoggedIn();
      }
    } catch (e) {
      if (e.name === "AuthenticationError") {
        console.log('Invalid e-mail');
      }
    }
  }

  render() {
    const { username } = this.state;
    return (
      <LoginScreenContainer>
        <LoginAreaContainer>
          <OneMinuteLoginIcon
            src={oneMinuteIconDark}
            alt="Welcome to the One Minute Story Editor"
          />
          <LogInHeader>Log In</LogInHeader>
          <LogInText>Please log in with your e-mail address.</LogInText>
          <SingleLineInput
            label="E-mail Address"
            style="dark"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
              username: e.target.value})
            }
          />
          <br />
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
