import React from 'react';

import styled from 'styled-components';

import StatusBar from '../components/StatusBar';
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

interface StoryEditorScreenProps {
  onLoggedOut: (loggedoutDueToAuthFailure?: boolean) => void;
};

interface StoryEditorScreenState {
  artworks: Artwork[],
  displayedArtwork?: Artwork;
  selectedCardIndex: number;
  isProcessing: boolean;
  statusBarMessage?: string;
  statusBarError?: string;
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
    selectedCardIndex: 0,
    isProcessing: false,
    statusBarMessage: undefined,
    statusBarError: undefined
  }

  componentDidMount() {
    this.init();
  }

  init = async () => await this.loadArtworks();

  handleTitleCardChange = (updatedArtwork: Artwork) => {
    this.updateArtworks(updatedArtwork);
  }

  handleArtworkSelect = (artwork: Artwork) => {
    this.setState({displayedArtwork: artwork});
  }

  handleCardIndexChange = (index: number) => {
    this.setState({selectedCardIndex: index});
  }

  handleServiceErrorGracefully = (e: Error, message?: string) => {
    if (e.name === "AuthenticationError") {
      this.props.onLoggedOut(true);
    } else {
      message && this.setState({statusBarError: message});
      console.log(e);
    }
  }

  addNewBlankArtwork = () => {
    if (!this.state.artworks.find((artwork: Artwork) => artwork.status === ArtworkStatus.New)) {
      const newArtworks: Artwork[] = [...this.state.artworks];
      const newArtwork: Artwork = {
        status: ArtworkStatus.New,
        title: '',
        year: '',
        artist_name: '',
        artist_nationality: '',
        story_segments: []
      };
      newArtworks.unshift(newArtwork);
      this.setState({
        artworks: newArtworks,
        displayedArtwork: newArtwork,
        selectedCardIndex: 0
      });
    }
  }

  loadArtworks = async () => {
    try {
      const artworks = await this.artworkService.loadAllArtworks();
      this.setState({artworks});
    } catch (e) {
      this.handleServiceErrorGracefully(e, 'A problem occurred while loading the stories. Please refresh the page and try again.');
    }
  }

  handleNewArtwork = async (artwork: Artwork, imageFile: File, imageFilename: string) => {
    this.setState({isProcessing: true});
    try {
      const newArtworkWithImage = await this.artworkService.createArtwork(artwork, imageFile, imageFilename);
      const artworks = await this.artworkService.loadAllArtworks();
      this.setState({
        artworks: artworks,
        displayedArtwork: newArtworkWithImage,
        selectedCardIndex: 1,
      });
    } catch (e) {
      this.handleServiceErrorGracefully(e, 'A problem occurred while uploading the image. Please refresh the page and try again.');
    } finally {
      this.setState({
        isProcessing: false
      });
    }
  }

  handleTitleCardImageSelect = async (artwork: Artwork, imageFile: File, imageFilename: string) => {
    this.setState({isProcessing: true});
    try {
      const artworkWithUpdatedImage: Artwork = await this.artworkService.updateArtworkImage(artwork, imageFile, imageFilename);
      if (this.state.displayedArtwork) {
        const updatedArtwork: Artwork = {...artwork};
        updatedArtwork.image_url = artworkWithUpdatedImage.image_url;
        updatedArtwork.image_with_aspect_ratio_url = artworkWithUpdatedImage.image_with_aspect_ratio_url;
        updatedArtwork.image_thumbnail_url = artworkWithUpdatedImage.image_thumbnail_url;
        this.updateArtworks(updatedArtwork);
      }
    } catch (e) {
      this.handleServiceErrorGracefully(e, 'A problem occurred while uploading the image. Please refresh the page and try again.');
    } finally {
      this.setState({isProcessing: false});
    }
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
    try {
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
        await this.artworkService.updateArtwork(updatedArtwork);
        this.setState({statusBarMessage: 'Changes saved automatically.'});
      }
    } catch (e) {
      this.handleServiceErrorGracefully(e, 'We are unable to save your changes. Please refresh the page and try again.');
    }
  }

  render() {

    const {
      artworks,
      displayedArtwork,
      selectedCardIndex,
      isProcessing,
      statusBarMessage,
      statusBarError
    } = this.state;
    const { onLoggedOut } = this.props;

    return (
      <StoryEditorContainer>
        <StatusBar
          message={statusBarMessage}
          error={statusBarError}
          onLogoutButtonClick={() => onLoggedOut()}
        />
        {artworks &&
          <Sidebar
            artworks={artworks}
            displayedArtwork={displayedArtwork}
            onArtworkSelect={this.handleArtworkSelect}
            onArtworkAdd={this.addNewBlankArtwork}
          />
        }
        {displayedArtwork &&
          <React.Fragment>
            <Phone
              artwork={displayedArtwork}
              storyPrompts={StoryPrompts}
              isProcessing={isProcessing}
              selectedIndex={selectedCardIndex}
              onIndexChange={this.handleCardIndexChange}
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
