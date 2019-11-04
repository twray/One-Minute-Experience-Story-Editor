import React from 'react';

import styled from 'styled-components';

import Button from './Button';

const IntroSectionContainer = styled.div`
  height: 100%;
  max-width: 700px;
  margin: 0 38px;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: scroll;
`;

const IntroSectionContainerInner = styled.div`
  height: 100vh;
  padding: 0;
  width: 100%;
  max-width: 600px;
  max-height: 820px;
  display: flex;
  flex-direction: column;
`;

const IntroSectionHeaderContainer = styled.div`
  height: 76.5px;
  min-height: 76.5px;
  width: 100%;
  display: flex;
  padding: 0 12px;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
`;

const IntroSectionHeader = styled.h2`
  margin: 0;
  color: #444444;
  padding: 0 0 18px 0;
  font-family: 'sf_compact_textmedium';
  position: relative;
`;

const IntroSectionBodyContainer = styled.div`
  padding: 0 12px;
  font-size: 16px;
  line-height: 24px;
  & h3 {
    margin-top: 40px;
  }
`;

const GetStartedButton = styled(Button)`
  display: block;
  margin: 30px 0;
`;

interface IntroSectionProps {
  onGetStartedButtonClick: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = props => {
  const { onGetStartedButtonClick } = props;
  return (
    <IntroSectionContainer>
      <IntroSectionContainerInner>
        <IntroSectionHeaderContainer>
          <IntroSectionHeader>
            Welcome to the One Minute Story Editor
          </IntroSectionHeader>
        </IntroSectionHeaderContainer>
        <IntroSectionBodyContainer>
          <p>
            You can use this tool to write short, informal stories about the objects you see in this museum. Visitors can use the One Minute mobile app to scan objects and read these stories.
          </p>
          <h3>
            Getting started
          </h3>
          <p>
            First, find an object in the museum that interests you. Then search for that object using our online <a href="https://dams-brightonmuseums.org.uk/assetbank-pavilion/action/viewHome" target="_blank">digital media bank</a> and download its image. Feel free to search or browse other objects that you may find interesting.
          </p>
          <p>
            Within this story editor tool, you can write a new story by clicking the <strong>+</strong> button at the top-left of the screen. To help you get started, we've provided some examples that you can look at.
          </p>
          <h3>
            Writing with a plot
          </h3>
          <p>
            When writing, choose an angle that will become the "plot" of the story. For example, if you were looking at a painting, frame the story around the artist's painting technique or how it depicts the people and places in that painting.
          </p>
          <p>&nbsp;</p>
          <GetStartedButton
            text="Write your first story"
            buttonStyle="tertiary"
            onClick={() => onGetStartedButtonClick()}
          />
        </IntroSectionBodyContainer>
      </IntroSectionContainerInner>
    </IntroSectionContainer>
  )
};

export default IntroSection;
