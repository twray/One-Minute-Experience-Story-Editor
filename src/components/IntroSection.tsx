import React from 'react';

import config from '../config/config.json';

import styled from 'styled-components';

import JSONHTMLParserService from '../services/JsonHtmlParserService';

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

  const { introScreenDesktop, introScreenMobile } = config.dialog;

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
            <div className="desktop-only">
              {introScreenDesktop.welcomeMessage}
            </div>
            <div className="mobile-only">
              {introScreenMobile.welcomeMessage}
            </div>
          </IntroSectionHeader>
        </IntroSectionHeaderContainer>
        <IntroSectionBodyContainer>
          <div
            className="desktop-only"
            dangerouslySetInnerHTML={
              {__html: JSONHTMLParserService.parseJSON(introScreenDesktop.htmlElements)}
            }>
          </div>
          <div
            className="mobile-only"
            dangerouslySetInnerHTML={
              {__html: JSONHTMLParserService.parseJSON(introScreenMobile.htmlElements)}
            }>
          </div>
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
