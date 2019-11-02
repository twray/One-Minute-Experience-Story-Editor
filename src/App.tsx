import React from 'react';
import styled from 'styled-components';

import StoryEditorScreen from './screens/StoryEditorScreen';
import LoginScreen from './screens/LoginScreen';

import './App.css'

const AppContainer = styled.div`
  background-color: #EFE6E7;
  width: 100%;
  height: 100%;
`;

interface AppProps { }

interface AppState {
  isLoggedIn: boolean;
}

class App extends React.Component<AppProps, AppState> {

  state = {
    isLoggedIn: false
  }

  render() {
    const { isLoggedIn } = this.state;
    return (
      <AppContainer>
        {!isLoggedIn && <LoginScreen onLoggedIn={() => this.setState({isLoggedIn: true})} />}
        {isLoggedIn && <StoryEditorScreen onLoggedOut={() => this.setState({isLoggedIn: false})} />}
      </AppContainer>
    );
  }

}

export default App;
