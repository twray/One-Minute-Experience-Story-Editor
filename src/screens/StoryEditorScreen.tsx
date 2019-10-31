import React, { Fragment } from 'react';
import styled from 'styled-components';

import Phone from '../components/Phone';
import ExampleArea from '../components/ExampleArea';

import ArtworkService from '../services/ArtworkService';

import { StoryPrompts } from '../data/StoryPrompts';

import {
  Artwork,
  ArtworkStatus,
  StorySegment
} from '../model/Artwork';

const StoryEditorContainer = styled.div`
  background-color: #EFE6E7;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface StoryEditorScreenProps {};

interface StoryEditorScreenState {
  artworks: Artwork[],
  displayedArtwork?: Artwork;
  currentIndex: number;
}

class StoryEditorScreen extends React.Component<
    StoryEditorScreenProps,
    StoryEditorScreenState
  > {

  state = {
    artworks: [],
    displayedArtwork: undefined,
    currentIndex: 0
  }

  componentDidMount() {
    this.loadArtworks();
  }

  loadArtworks = async () => {

    try {
      const artworkService = new ArtworkService();
      const artworks = await artworkService.loadAllArtworks();
      this.setState({artworks});
    } catch (e) {
      console.log('Unable to load artworks');
    }

    // TEST: Display Artwork from DB
    // this.setState({displayedArtwork: this.state.artworks[4]});

    // TEST: Display Empty Artwork
    this.setState({displayedArtwork: {
      status: ArtworkStatus.New,
      title: '',
      year: '',
      artist_name: '',
      artist_nationality: '',
      story_segments: []
    }});

  }

  handleCardIndexChange = (newIndex: number) => {
    this.setState({currentIndex: newIndex});
  }

  handleStorySegmentChange = (updatedStorySegment: StorySegment) => {

    const updatedArtwork: Artwork = Object.assign({}, this.state.displayedArtwork);
    updatedArtwork.story_segments = updatedArtwork.story_segments.map((storySegment: StorySegment) => {
      if (storySegment.id === updatedStorySegment.id) {
        return updatedStorySegment;
      } else {
        return storySegment;
      }
    });
    this.updateArtworks(updatedArtwork);

  }

  handleTitleCardChange = (updatedArtwork: Artwork) => {
    this.updateArtworks(updatedArtwork);
  }

  updateArtworks = (updatedArtwork: Artwork) => {
    const updatedArtworks: Artwork[] = this.state.artworks.map((artworkInList: Artwork) => {
      if (artworkInList.id === updatedArtwork.id) {
        return updatedArtwork;
      } else {
        return artworkInList;
      }
    });
    this.setState({artworks: updatedArtworks});
    this.setState({displayedArtwork: updatedArtwork});
    // TODO: Update data store when artwork meta changes, use a debouncer
  }

  render() {
    const { displayedArtwork, currentIndex } = this.state;
    return (
      <StoryEditorContainer>
        {displayedArtwork &&
          <Fragment>
            <Phone
              artwork={displayedArtwork}
              storyPrompts={StoryPrompts}
              onTitleCardChange={this.handleTitleCardChange}
              onStorySegmentChange={this.handleStorySegmentChange}
              onCardIndexChange={this.handleCardIndexChange}
            />
            <ExampleArea
              storyPrompts={StoryPrompts}
              currentIndex={currentIndex}
            />
          </Fragment>
        }
      </StoryEditorContainer>
    );
  }
}

export default StoryEditorScreen;
