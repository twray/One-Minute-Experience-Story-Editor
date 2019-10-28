import React from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import { CardContainer } from '../components/Card';
import GeneralStorySegmentCard from '../components/GeneralStorySegmentCard';

import { Artwork, StorySegment, ArtworkThumbnail, StoryPrompt } from '../model/Artwork';

import { StoryPrompts } from '../data/StoryPrompts';

interface PhoneScreenProps {}

interface PhoneScreenState {
  currentIndex: number;
  xOffset: number;
  displayedArtwork: Artwork;
}

// TODO: Make the card carousel responsive, adjust fixed pixel width
// value

const phoneScreenWidth: number = 375;

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
  width: ${(StoryPrompts.length * phoneScreenWidth) + phoneScreenWidth}px;
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


class PhoneScreen extends React.Component<PhoneScreenProps, PhoneScreenState> {

  state = {
    currentIndex: 0,
    xOffset: 0,
    displayedArtwork: {
      id: 0,
      title: '',
      image_url: '',
      story_segments: []
    }
  }

  componentDidMount() {
    this.loadArtwork(350);
  }

  // TODO: Add Error Handling
  loadArtwork = async (artworkId: number) => {

    const response = await fetch(`https://modgift.itu.dk/1mev2/_/items/artwork/${artworkId}?fields=*,image.*`);
    const result = await response.json();
    const { data } = result;
    const displayedArtwork: Artwork = {
      id: data.id,
      title: data.title,
      artist_name: data.artist_name,
      artist_nationality: data.artist_nationality,
      year: data.year,
      image_url: data.image.data.thumbnails.find((thumbnail: ArtworkThumbnail) => {
        return thumbnail.dimension === '1024x1024'
      }).url,
      story_segments: [
        {id: 1, story_segment: data.story_segment_1},
        {id: 2, story_segment: data.story_segment_2},
        {id: 3, story_segment: data.story_segment_3},
        {id: 4, story_segment: data.story_segment_4},
        {id: 5, story_segment: data.story_segment_5}
      ]
    };
    this.setState({displayedArtwork});
  }

  nextCard = () => {
    if (this.state.currentIndex < (StoryPrompts.length - 1)) {
      this.setState({
        currentIndex: this.state.currentIndex + 1,
        xOffset: this.state.xOffset + phoneScreenWidth
      });
    }
  }

  prevCard = () => {
    if (this.state.currentIndex > 0) {
      this.setState({
        currentIndex: this.state.currentIndex - 1,
        xOffset: this.state.xOffset - phoneScreenWidth
      });
    }
  }

  handleStorySegmentChange = (storySegment: StorySegment) => {
    const updatedDisplayedArtwork: Artwork = Object.assign({}, this.state.displayedArtwork);
    let storySegmentToUpdate: StorySegment|undefined = updatedDisplayedArtwork.story_segments.find((updatedStorySegment: StorySegment) => {
      return updatedStorySegment.id === storySegment.id;
    });
    if (storySegmentToUpdate) {
      storySegmentToUpdate.story_segment = storySegment.story_segment;
      this.setState({displayedArtwork: updatedDisplayedArtwork});
    }
  }

  render() {
    const { xOffset, displayedArtwork } = this.state;
    return (
      <PhoneScreenContainer>
        {this.state.displayedArtwork &&
          <PhoneScreenContainerBackground
            style={displayedArtwork ? {backgroundImage: `url('${displayedArtwork.image_url}')`} : {}}
          />
        }
        <CardCarousel style={{transform: `translateX(-${xOffset}px)`}}>
          {this.state.displayedArtwork && StoryPrompts.map((storyPrompt: StoryPrompt, i: number) => {

              const storySegment: StorySegment = displayedArtwork.story_segments.find((storySegment: StorySegment) => {
                return storySegment.id === (i + 1);
              }) || {id: 0, story_segment: ''};

              return (
                <CardContainer key={storyPrompt.id}>
                  <GeneralStorySegmentCard
                    prompt={storyPrompt}
                    storySegment={storySegment}
                    handleStorySegmentChange={this.handleStorySegmentChange}
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
          disabled={this.state.currentIndex === (StoryPrompts.length - 1)}
          >
            <FontAwesomeIcon icon={faAngleRight} size="2x" />
          </CardNavigationButton>
        </CardNavigation>
      </PhoneScreenContainer>
    );
  }
}

export default PhoneScreen;
