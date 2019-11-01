import React, { ErrorInfo } from 'react';
import styled from 'styled-components';

import StoryEditorScreen from './screens/StoryEditorScreen';

import './App.css'

const AppContainer = styled.div`
  background-color: #EFE6E7;
  width: 100%;
  height: 100%;
`;

class App extends React.Component {

  render() {
    return (
      <AppContainer>
        <StoryEditorScreen />
      </AppContainer>
    );
  }

}

export default App;
