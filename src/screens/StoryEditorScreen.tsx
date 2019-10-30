import React from 'react';
import styled from 'styled-components';

import Phone from '../components/Phone';

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
  displayedArtwork: Artwork;
}

class StoryEditorScreen extends React.Component<
    StoryEditorScreenProps,
    StoryEditorScreenState
  > {

  state = {
    artworks: [],
    displayedArtwork: {
      status: ArtworkStatus.New,
      title: '',
      artist_name: '',
      artist_nationality: '',
      year: '',
      image_url: '',
      story_segments: []
    }
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

    const displayedArtwork: Artwork|undefined = this.state.artworks.find((artwork: Artwork) => {
      return artwork.id === 6;
    });
    if (displayedArtwork) {
      this.setState({displayedArtwork});
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
    const { displayedArtwork } = this.state;
    return (
      <StoryEditorContainer>
        <Phone
          artwork={displayedArtwork}
          storyPrompts={StoryPrompts}
          handleStorySegmentChange={this.handleStorySegmentChange}
        />
      </StoryEditorContainer>
    );
  }
}

export default StoryEditorScreen;
