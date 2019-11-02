import React from 'react';
import styled from 'styled-components';

import StoryEditorScreen from './screens/StoryEditorScreen';
import LoginScreen from './screens/LoginScreen';

import AuthenticationService from './services/AuthenticationService';

import './App.css'

const AppContainer = styled.div`
  background-color: #EFE6E7;
  width: 100%;
  height: 100%;
`;

interface AppProps { }

interface AppState {
  isLoggedin: boolean;
  isLoggedoutDueToAuthFailure: boolean;
}

class App extends React.Component<AppProps, AppState> {

  authenticationService: AuthenticationService = new AuthenticationService();

  state = {
    isLoggedin: false,
    isLoggedoutDueToAuthFailure: false
  }

  handleLogin = () => { 
    this.setState({isLoggedin: true})
  };

  handleLogout = (loggedoutDueToAuthFailure: boolean = false) => {
    console.log(loggedoutDueToAuthFailure);
    this.authenticationService.logout();
    this.setState({
      isLoggedin: false,
      isLoggedoutDueToAuthFailure: loggedoutDueToAuthFailure
    });
  }

  render() {
    const { isLoggedin, isLoggedoutDueToAuthFailure } = this.state;
    return (
      <AppContainer>
        {(isLoggedin || isLoggedoutDueToAuthFailure) &&
          <StoryEditorScreen onLoggedOut={this.handleLogout}  />
        }
        {!isLoggedin &&
          <LoginScreen
            loggingInAgain={isLoggedoutDueToAuthFailure}
            onLoggedIn={this.handleLogin}
          />
        }
      </AppContainer>
    );
  }

}

export default App;
