import React from 'react';

import styled from 'styled-components';

import { Artwork, ArtworkStatus } from '../model/Artwork';

import Button from './Button';

const IntroSectionContainer = styled.div`
  max-width: 700px;
  margin: 0 38px;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: scroll;
  & .desktop-only {
    display: block;
  }
  & .mobile-only {
    display: none;
  }
  @media screen and (max-width: 1280px) {
    height: 100%;
    margin: 0;
  }
  @media screen and (max-width: 576px) {
    display: block;
    & .desktop-only {
      display: none;
    }
    & .mobile-only {
      display: block;
    }
  }
`;

const IntroSectionContainerInner = styled.div`
  height: 100vh;
  padding: 0;
  width: 100%;
  max-width: 600px;
  max-height: 820px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1280px) {
    max-height: none;
    margin-top: 72px;
  }
  @media screen and (max-width: 576px) {
    margin-top: 128px;
    height: auto;
  }
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
  @media screen and (max-width: 576px) {
    padding: 0 24px;
  }
`;

const IntroSectionHeader = styled.h2`
  margin: 0;
  color: #444444;
  padding: 0 0 18px 0;
  line-height: 32px;
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
  @media screen and (max-width: 576px) {
    margin-top: 20px;
    padding: 0 24px;
  }
`;

const GetStartedButton = styled(Button)`
  display: block;
  margin: 30px 0;
`;

interface IntroSectionProps {
  artworks?: Artwork[];
  onGetStartedButtonClick: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = props => {

  const { artworks, onGetStartedButtonClick } = props;

  let displayCreateNewStoryButton: boolean = true;
  if (artworks) {
    if (artworks.find((artwork: Artwork) => artwork.status === ArtworkStatus.New)) {
      displayCreateNewStoryButton = false;
    }
  }

  return (
    <IntroSectionContainer>
      <IntroSectionContainerInner>
        <IntroSectionHeaderContainer>
          <IntroSectionHeader>
            Welcome to the One Minute Story Editor
          </IntroSectionHeader>
        </IntroSectionHeaderContainer>
        <IntroSectionBodyContainer>
          <p className="desktop-only">
            You can use this tool to write short, informal stories about the objects you see in this museum. Visitors can use the One Minute mobile app to scan objects and read these stories.
          </p>
          <p className="mobile-only">
            You can use this tool to write short, informal stories about the objects you see in this museum.
          </p>
          <h3>
            Getting started
          </h3>
          <p className="desktop-only">
            First, find an object in the museum that interests you. Then search for that object using our online <a href="https://dams-brightonmuseums.org.uk/assetbank-pavilion/action/viewHome" target="_blank" rel="noopener noreferrer">digital media bank</a> and download its image. Feel free to search or browse other objects that you may find interesting.
          </p>
          <p className="desktop-only">
            You can use this tool to write a story about that object. To help you get started, we've provided some examples that you can look at.
          </p>
          <p className="mobile-only">
            First, find an object in the museum that interests you. Tap the menu icon to browse some of the examples we've provided for you, or you can start writing your own story by tapping 'Add New'.
          </p>
          <h3>
            Writing with a plot
          </h3>
          <p>
            When writing, choose an angle that will become the "plot" of the story. For example, if you were looking at a painting, frame the story around the artist's painting technique or how it depicts the people and places in that painting.
          </p>
          <p>&nbsp;</p>
          {displayCreateNewStoryButton &&
            <GetStartedButton
              text="Create a New Story"
              buttonStyle="tertiary"
              onClick={() => onGetStartedButtonClick()}
            />
          }
          <p>&nbsp;</p>
        </IntroSectionBodyContainer>
      </IntroSectionContainerInner>
    </IntroSectionContainer>
  )
};

export default IntroSection;
