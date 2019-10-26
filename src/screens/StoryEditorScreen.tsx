import React from 'react';
import styled from 'styled-components';

import Phone from '../components/Phone';

const StoryEditorContainer = styled.div`
  background-color: #EFE6E7;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StoryEditorScreen: React.FC = () => {
  return (
    <StoryEditorContainer>
      <Phone />
    </StoryEditorContainer>
  );
}

export default StoryEditorScreen;
