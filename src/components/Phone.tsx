import React, { Fragment } from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import Button from '../components/Button';
import { CardContainer } from '../components/Card';
import TitleCard from '../components/TitleCard';
import GeneralStorySegmentCard from '../components/GeneralStorySegmentCard';

import phoneShellImg from '../assets/images/phone-shell.svg';

import {
  Artwork,
  ArtworkStatus,
  StorySegment,
  StoryPrompt
} from '../model/Artwork';

// TODO: Make the card carousel responsive,
// adjust fixed pixel width value

const phoneScreenWidth: number = 375;

const PhoneContainer = styled.div`
  width: 410px;
  height: 820px;
  margin: 0 38px;
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
  selectedIndex?: number;
  onIndexChange?: (index: number) => void;
  onTitleCardChange: (artwork: Artwork) => void;
  onNewArtworkWithImage: (artwork: Artwork, imageFile: File, imageFilename: string) => void;
  onImageUpdate: (artwork: Artwork, imageFile: File, imageFilename: string) => void;
  onStorySegmentChange: (storySegment: StorySegment) => void;
}

interface PhoneState {
  xOffset: number;
  currentIndex: number;
  selectedImageFile? : File
  selectedImageFilename?: string
}

class Phone extends React.Component<PhoneProps, PhoneState> {

  state = {
    xOffset: 0,
    currentIndex: 0,
    selectedImageFile: undefined,
    selectedImageFilename: ''
  }

  componentDidUpdate(prevProps: PhoneProps) {
    if (this.props.selectedIndex != null &&
        this.props.selectedIndex !== prevProps.selectedIndex &&
        this.props.selectedIndex !== this.state.currentIndex
      ) {
      this.setIndex(this.props.selectedIndex);
    }
  }

  setIndex = (index: number) => {
    this.setState({
      currentIndex: index,
      xOffset: phoneScreenWidth * index
    });
  }

  handleImageSelect = async (artwork: Artwork, imageFile: File, imageFilename: string) => {
    this.setState({
      selectedImageFile: imageFile,
      selectedImageFilename: imageFilename
    });
    if (this.props.artwork && this.props.artwork.status !== ArtworkStatus.New) {
      this.props.onImageUpdate(artwork, imageFile, imageFilename);
    } else if (this.props.artwork && this.props.artwork.status === ArtworkStatus.New) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      const fileData: string|ArrayBuffer|null = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject();
      });
      if (typeof fileData === 'string') {
        const updatedArtwork: Artwork = {...this.props.artwork};
        updatedArtwork.image_url = fileData;
        updatedArtwork.image_thumbnail_url = fileData;
        this.props.onTitleCardChange(updatedArtwork);
      }
    }
  }

  handleContinueButtonClick = () => {
    if (
      this.props.artwork &&
      this.props.artwork.status === ArtworkStatus.New &&
      this.props.artwork.title
    ) {
      const artwork: Artwork|undefined = this.props.artwork;
      const imageFile: File|undefined = this.state.selectedImageFile;
      const imageFilename: string|undefined = this.state.selectedImageFilename;
      if (artwork && imageFile && imageFilename) {
        this.props.onNewArtworkWithImage(
          artwork,
          imageFile,
          imageFilename
        );
      }
    }
  }

  nextCard = () => {
    if (this.state.currentIndex < (this.props.storyPrompts.length)) {
      const newIndex = this.state.currentIndex + 1
      this.setIndex(newIndex);
      this.props.onIndexChange && this.props.onIndexChange(newIndex);
    }
  }

  prevCard = () => {
    if (this.state.currentIndex > 0) {
      const newIndex = this.state.currentIndex - 1
      this.setIndex(newIndex);
      this.props.onIndexChange && this.props.onIndexChange(newIndex);
    }
  }

  render() {
    const { 
      artwork,
      storyPrompts,
      isProcessing,
      onTitleCardChange,
      onStorySegmentChange
    } = this.props;
    const { xOffset, selectedImageFile, currentIndex } = this.state;
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
                    onImageSelect={this.handleImageSelect}
                  />
                </CardContainer>
                {artwork && artwork.status !== ArtworkStatus.New && storyPrompts.map((storyPrompt: StoryPrompt, i: number) => {

                    const storySegment: StorySegment = artwork.story_segments.find((storySegment: StorySegment) => {
                      return storySegment.id === i + 1;
                    }) || {id: 0, story_segment: ''};

                    return (
                      <CardContainer key={storyPrompt.id}>
                        <GeneralStorySegmentCard
                          prompt={storyPrompt}
                          storySegment={storySegment}
                          readOnly={artwork.is_example}
                          onStorySegmentChange={onStorySegmentChange}
                        />
                      </CardContainer>
                    );

                  })
                }
              </CardCarousel>
              {artwork && artwork.status !== ArtworkStatus.New &&
                <CardNavigation>
                  <CardNavigationButton
                    type="button"
                    value="Prev"
                    onClick={this.prevCard}
                    disabled={currentIndex === 0}
                  >
                    <FontAwesomeIcon icon={faAngleLeft} size="2x" />
                  </CardNavigationButton>
                  <CardNavigationButton
                    type="button"
                    value="Next"
                    onClick={this.nextCard}
                    disabled={currentIndex === storyPrompts.length}
                    >
                    <FontAwesomeIcon icon={faAngleRight} size="2x" />
                  </CardNavigationButton>
                </CardNavigation>
              }
              {artwork && artwork.status === ArtworkStatus.New &&
                <CardNavigation>
                  <Button
                    text="Continue"
                    buttonStyle="tertiary"
                    disabled={!(artwork.title && selectedImageFile)}
                    onClick={this.handleContinueButtonClick}
                  />
                </CardNavigation>
              }
            </Fragment>
          }
        </PhoneScreenContainer>
      </PhoneContainer>
    );
  }
}

export default Phone;
