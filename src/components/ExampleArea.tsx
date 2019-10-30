import React from 'react';

import styled from 'styled-components';

import { StoryPrompt } from '../model/Artwork';

const ExampleAreaContainer = styled.div`
  position: absolute;
  margin-left: ${(410 / 2) + (300 / 2) + 38}px;
  height: calc(100vh - 200px);
  max-height: 467px;
  width: 300px;
  display: flex;
  flex-direction: column;
`;

const TitleSection = styled.div`
  flex: 2.5;
  padding: 10% 0;
  position: relative;
`;

const Title = styled.label`
  color: #666666;
  font-family: 'sf_compact_textmedium';
  position: absolute;
  bottom: 0;
`;

const ExampleSection = styled.div`
  flex: 5;
  padding: 10% 0;
`;

const Example = styled.p`
  color: #444444;
  margin-top: 0;
`;

interface ExampleAreaProps {
  storyPrompts: StoryPrompt[];
  currentIndex: number;
};

const ExampleArea: React.FC<ExampleAreaProps> = props => {

  const { storyPrompts, currentIndex } = props;
  let exampleText: string = '';
  if (currentIndex > 0) {
    const currentStoryPrompt: StoryPrompt|undefined = storyPrompts.find((storyPrompt: StoryPrompt) => {
      return storyPrompt.id === currentIndex;
    });
    if (currentStoryPrompt) {
      exampleText = currentStoryPrompt.example;
    }
  }

  return (
    <ExampleAreaContainer>
      <TitleSection>
        <Title>
          {currentIndex > 0 && 'Example'}
        </Title>
      </TitleSection>
      <ExampleSection>
        <Example>
          {currentIndex === 0 && 'You need to provide at least a title and image of the artwork. If possible, try and provide a high quality image of the work.'}
          {currentIndex > 0 && exampleText}
        </Example>
      </ExampleSection>
    </ExampleAreaContainer>
  )
  
};

export default ExampleArea;
