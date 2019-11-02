import React from 'react';

import styled from 'styled-components';

import Sidebar from '../components/Sidebar';
import Phone from '../components/Phone';
import PreviewImage from '../components/PreviewImage';

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
  justify-content: flex-start;
  align-items: center;
`;

interface StoryEditorScreenProps {};

interface StoryEditorScreenState {
  artworks: Artwork[],
  displayedArtwork?: Artwork;
  isProcessing: boolean;
}

class StoryEditorScreen extends React.Component<
    StoryEditorScreenProps,
    StoryEditorScreenState
  > {

  authenticationService: AuthenticationService = new AuthenticationService();
  artworkService: ArtworkService = new ArtworkService();

  state = {
    artworks: [],
    displayedArtwork: undefined,
    isProcessing: false
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {

    await this.login();
    await this.loadArtworks();

    // TODO: Create a better scheme to make sure that the user stays,
    // securely logged in, even if they sleep or close their computer
    // for a while
    window.onfocus = async () => {
      try {
        AuthenticationService.refreshAuthToken();
      } catch (e) {
        if (e.name === 'AuthenticationError') {
          // TODO: Remove this, and let the HOC ErrorBoundary or
          // something nicer log out the
          // user if the token expires.
          this.login();
        } else {
          throw e;
        }
      }
    };
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

  }

  handleTitleCardChange = (updatedArtwork: Artwork) => {
    this.updateArtworks(updatedArtwork);
  }

  handleArtworkSelect= (artwork: Artwork) => {
    this.setState({displayedArtwork: artwork});
  }

  handleNewArtwork = async (artwork: Artwork, imageFile: File, imageFilename: string) => {
    this.setState({isProcessing: true});
    const newArtworkWithImage = await this.artworkService.createArtwork(artwork, imageFile, imageFilename);
    this.setState({
      displayedArtwork: newArtworkWithImage,
      isProcessing: false
    });
  }

  handleTitleCardImageSelect = async (artwork: Artwork, imageFile: File, imageFilename: string) => {
    this.setState({isProcessing: true});
    const artworkWithUpdatedImage: Artwork = await this.artworkService.updateArtworkImage(artwork, imageFile, imageFilename);
    if (this.state.displayedArtwork) {
      const updatedArtwork: Artwork = {...artwork};
      updatedArtwork.image_url = artworkWithUpdatedImage.image_url;
      updatedArtwork.image_with_aspect_ratio_url = artworkWithUpdatedImage.image_with_aspect_ratio_url;
      updatedArtwork.image_thumbnail_url = artworkWithUpdatedImage.image_thumbnail_url;
      this.updateArtworks(updatedArtwork);
    }
    this.setState({isProcessing: false});
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

  addNewArtwork = () => {

    const newArtworks: Artwork[] = [...this.state.artworks];

    const newArtwork: Artwork = {
      status: ArtworkStatus.New,
      title: '',
      year: '',
      artist_name: '',
      artist_nationality: '',
      story_segments: []
    };

    newArtworks.push(newArtwork);

    this.setState({
      artworks: newArtworks,
      displayedArtwork: newArtwork
    });

  }

  render() {
    const { artworks, displayedArtwork, isProcessing } = this.state;
    return (
      <StoryEditorContainer>
        {artworks &&
          <Sidebar
            artworks={artworks}
            displayedArtwork={displayedArtwork}
            onArtworkSelect={this.handleArtworkSelect}
          />
        }
        {displayedArtwork &&
          <React.Fragment>
            <Phone
              artwork={displayedArtwork}
              storyPrompts={StoryPrompts}
              isProcessing={isProcessing}
              onTitleCardChange={this.handleTitleCardChange}
              onNewArtworkWithImage={this.handleNewArtwork}
              onImageUpdate={this.handleTitleCardImageSelect}
              onStorySegmentChange={this.handleStorySegmentChange}
            />
            <PreviewImage artwork={displayedArtwork} />
          </React.Fragment>
        }
      </StoryEditorContainer>
    );
  }
}

export default StoryEditorScreen;
