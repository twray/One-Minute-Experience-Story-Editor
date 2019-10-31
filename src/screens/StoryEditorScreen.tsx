import React, { Fragment } from 'react';
import styled from 'styled-components';

import Phone from '../components/Phone';
import ExampleArea from '../components/ExampleArea';

import AuthenticationService from '../services/AuthenticationService';
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

  artworkService: ArtworkService = new ArtworkService();

  state = {
    artworks: [],
    displayedArtwork: undefined,
    currentIndex: 0
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    await this.login();
    await this.loadArtworks();
  }

  login = async () => {
    // TEST: Login
    const authenticationService = new AuthenticationService();
    try {
      await authenticationService.login(
        process.env.REACT_APP_MOCK_USERNAME || '',
        process.env.REACT_APP_MOCK_PASSWORD || ''
      );
    } catch (e) {
      console.log('Unable to login');
      console.log(e);
    }
  }

  loadArtworks = async () => {

    try {
      const artworks = await this.artworkService.loadAllArtworks();
      this.setState({artworks});
    } catch (e) {
      console.log('Unable to load artworks');
      throw e;
    }

    // TEST: Display Artwork from DB
    this.setState({displayedArtwork: this.state.artworks[2]});

    // TEST: Display Empty Artwork
    /*
    this.setState({displayedArtwork: {
      status: ArtworkStatus.New,
      title: '',
      year: '',
      artist_name: '',
      artist_nationality: '',
      story_segments: []
    }});
    */

  }

  handleCardIndexChange = (newIndex: number) => {
    this.setState({currentIndex: newIndex});
  }

  handleTitleCardChange = (updatedArtwork: Artwork) => {
    this.updateArtworks(updatedArtwork);
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

  handleTitleCardImageSelect = (artwork: Artwork, imageDataBase64: string, imageFilename: string) => {
    this.artworkService.updateArtworkImage(artwork, imageDataBase64, imageFilename);
  }

  updateArtworks = async (updatedArtwork: Artwork) => {
    const updatedArtworks: Artwork[] = this.state.artworks.map((artworkInList: Artwork) => {
      if (artworkInList.id === updatedArtwork.id) {
        return updatedArtwork;
      } else {
        return artworkInList;
      }
    });
    this.setState({artworks: updatedArtworks});
    this.setState({displayedArtwork: updatedArtwork});
    if (updatedArtwork.status !== ArtworkStatus.New) {
      this.artworkService.updateArtwork(updatedArtwork);
    }
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
              onTitleCardImageSelect={this.handleTitleCardImageSelect}
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
