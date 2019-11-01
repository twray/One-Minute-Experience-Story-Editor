import React, { Fragment } from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import { CardContainer } from '../components/Card';
import TitleCard from '../components/TitleCard';
import GeneralStorySegmentCard from '../components/GeneralStorySegmentCard';

import phoneShellImg from '../assets/images/phone-shell.svg';

import {
  Artwork,
  StorySegment,
  StoryPrompt
} from '../model/Artwork';

// TODO: Make the card carousel responsive,
// adjust fixed pixel width value

const phoneScreenWidth: number = 375;

const PhoneContainer = styled.div`
  width: 410px;
  height: 820px;
  background-image: url(${phoneShellImg});
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PhoneScreenContainer = styled.div`
  background-color: #F4F4F4;
  width: 100vw;
  height: 100vh;
  max-width: 375px;
  max-height: 667px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const PhoneScreenContainerBackground = styled.div`
  position: absolute;
  top: -20px;
  bottom: -20px;
  left: -20px;
  right: -20px;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(20px);
  z-index: 0;
`;

const CardCarousel = styled.div`
  width: 0;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  transition: transform 0.5s;
`;

const CardNavigation = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0 60px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
`;

const CardNavigationButton = styled.button`
  border: none;
  background-color: #FFFFFF;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  padding: 0;
  &:active {
    background-color: #EEEEEE;
  }
  &:disabled {
    opacity: 0.5;
  }
`;

interface PhoneProps {
  artwork?: Artwork,
  storyPrompts: StoryPrompt[],
  isProcessing: boolean;
  onCardIndexChange: (newIndex: number) => void;
  onTitleCardChange: (artwork: Artwork) => void;
  onTitleCardImageSelect: (artwork: Artwork, imageFile: File, imageFilename: string) => void;
  onStorySegmentChange: (storySegment: StorySegment) => void;
}

interface PhoneState {
  currentIndex: number;
  xOffset: number;
}

class Phone extends React.Component<PhoneProps, PhoneState> {

  state = {
    currentIndex: 0,
    xOffset: 0
  }

  setIndex = (index: number) => {
    this.setState({
      currentIndex: index,
      xOffset: phoneScreenWidth * index
    });
    this.props.onCardIndexChange(index);
  }

  nextCard = () => {
    if (this.state.currentIndex < (this.props.storyPrompts.length)) {
      this.setIndex(this.state.currentIndex + 1);
    }
  }

  prevCard = () => {
    if (this.state.currentIndex > 0) {
      this.setIndex(this.state.currentIndex - 1);
    }
  }

  render() {
    const { xOffset } = this.state;
    const { 
      artwork,
      storyPrompts,
      isProcessing,
      onTitleCardChange,
      onTitleCardImageSelect,
      onStorySegmentChange
    } = this.props;
    return (
      <PhoneContainer>
        <PhoneScreenContainer>
          {artwork &&
            <Fragment>
              <PhoneScreenContainerBackground
                style={artwork ? {backgroundImage: `url('${artwork.image_url}')`} : {}}
              />
              <CardCarousel style={
                {
                  transform: `translateX(-${xOffset}px)`,
                  width: `${(storyPrompts.length * phoneScreenWidth) + phoneScreenWidth}px`
                }
              }>
                <CardContainer>
                  <TitleCard
                    artwork={artwork}
                    isProcessing={isProcessing}
                    onChange={onTitleCardChange}
                    onImageSelect={onTitleCardImageSelect}
                  />
                </CardContainer>
                {artwork && storyPrompts.map((storyPrompt: StoryPrompt, i: number) => {

                    const storySegment: StorySegment = artwork.story_segments.find((storySegment: StorySegment) => {
                      return storySegment.id === i + 1;
                    }) || {id: 0, story_segment: ''};

                    return (
                      <CardContainer key={storyPrompt.id}>
                        <GeneralStorySegmentCard
                          prompt={storyPrompt}
                          storySegment={storySegment}
                          onStorySegmentChange={onStorySegmentChange}
                        />
                      </CardContainer>
                    );

                  })
                }
              </CardCarousel>
              <CardNavigation>
                <CardNavigationButton
                  type="button"
                  value="Prev"
                  onClick={this.prevCard}
                  disabled={this.state.currentIndex === 0}
                >
                  <FontAwesomeIcon icon={faAngleLeft} size="2x" />
                </CardNavigationButton>
                <CardNavigationButton
                  type="button"
                  value="Next"
                  onClick={this.nextCard}
                  disabled={this.state.currentIndex === storyPrompts.length}
                  >
                  <FontAwesomeIcon icon={faAngleRight} size="2x" />
                </CardNavigationButton>
              </CardNavigation>
            </Fragment>
          }
        </PhoneScreenContainer>
      </PhoneContainer>
    );
  }
}

export default Phone;
