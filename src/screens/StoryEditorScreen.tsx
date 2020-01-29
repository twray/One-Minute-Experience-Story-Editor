import React from 'react';

import styled from 'styled-components';

import StatusBar from '../components/StatusBar';
import Sidebar from '../components/Sidebar';
import Phone from '../components/Phone';
import IntroSection from '../components/IntroSection';
import PreviewImage from '../components/PreviewImage';

import AuthenticationService from '../services/AuthenticationService';
import ArtworkService from '../services/ArtworkService';

import StoryPrompts from '../data/StoryPrompts';

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
  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

interface StoryEditorScreenProps {
  onLoggedOut: (loggedoutDueToAuthFailure?: boolean) => void;
};

interface StoryEditorScreenState {
  artworks: Artwork[],
  displayedArtwork: Artwork|null;
  selectedCardIndex: number;
  isProcessing: boolean;
  sidebarIsDisplayed: boolean;
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
    displayedArtwork: null,
    selectedCardIndex: 0,
    isProcessing: false,
    sidebarIsDisplayed: false,
    statusBarMessage: undefined,
    statusBarError: undefined
  }

  componentDidMount() {
    this.init();
  }

  init = async () => await this.loadArtworks();

  handleHamburgerMenuClick = () => {
    this.setState({sidebarIsDisplayed: !this.state.sidebarIsDisplayed});
  }

  handleTitleCardChange = (updatedArtwork: Artwork) => {
    this.updateArtworks(updatedArtwork);
  }

  handleArtworkSelect = (artwork: Artwork) => {
    this.setState({
      displayedArtwork: artwork,
      selectedCardIndex: 0,
      sidebarIsDisplayed: false
    });
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
        story_segments: [],
        is_example: false,
        created_by_user_id: (AuthenticationService.loggedInUser && AuthenticationService.loggedInUser.id) || undefined,
        created_just_now: true,
        first_time_writing_story: true
      };
      newArtworks.unshift(newArtwork);
      this.setState({
        artworks: newArtworks,
        displayedArtwork: newArtwork,
        selectedCardIndex: 0,
        sidebarIsDisplayed: false
      });
    }
  }

  hidePhone = () => {
    this.setState({displayedArtwork: null});
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
      const artworksWithNewStory: Artwork[] = artworks.map((artwork: Artwork) => {
        if (artwork.id === newArtworkWithImage.id) {
          artwork.first_time_writing_story = newArtworkWithImage.first_time_writing_story;
        }
        return artwork;
      });
      this.setState({
        artworks: artworksWithNewStory,
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

  handleDeleteArtwork = async (artwork: Artwork) => {
    try {
      const updatedArtworks: Artwork[] = this.state.artworks.filter((artworkToDelete: Artwork) => {
        return artworkToDelete.id !== artwork.id;
      });
      this.setState({
        artworks: updatedArtworks,
        displayedArtwork: null
      });
      if (artwork.status !== ArtworkStatus.New) {
        await this.artworkService.deleteArtwork(artwork);
      }
    } catch (e) {
      this.handleServiceErrorGracefully(e, 'A problem occurred while deleting the story. Please refresh the page and try again.');
      this.loadArtworks();
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
      sidebarIsDisplayed,
      statusBarMessage,
      statusBarError
    } = this.state;
    const { onLoggedOut } = this.props;

    return (
      <StoryEditorContainer>
        <StatusBar
          message={statusBarMessage}
          error={statusBarError}
          sidebarIsHidden={!sidebarIsDisplayed}
          displayedArtwork={displayedArtwork}
          onLogoutButtonClick={() => onLoggedOut()}
          onHamburgerMenuClick={() => this.handleHamburgerMenuClick()}
        />
        {artworks &&
          <Sidebar
            artworks={artworks}
            displayedArtwork={displayedArtwork || undefined}
            isHidden={!sidebarIsDisplayed}
            onArtworkSelect={this.handleArtworkSelect}
            onArtworkDelete={this.handleDeleteArtwork}
            onArtworkAdd={this.addNewBlankArtwork}
            onLogoutButtonClick={() => onLoggedOut()}
          />
        }
        {displayedArtwork &&
          <>
            <Phone
              artwork={displayedArtwork || undefined}
              storyPrompts={StoryPrompts}
              isProcessing={isProcessing}
              selectedIndex={selectedCardIndex}
              onIndexChange={this.handleCardIndexChange}
              onTitleCardChange={this.handleTitleCardChange}
              onNewArtworkWithImage={this.handleNewArtwork}
              onImageUpdate={this.handleTitleCardImageSelect}
              onStorySegmentChange={this.handleStorySegmentChange}
              onClose={this.hidePhone}
            />
            <PreviewImage artwork={displayedArtwork || undefined} />
          </>
        }
        {!displayedArtwork &&
          <IntroSection
            artworks={artworks}
            onGetStartedButtonClick={this.addNewBlankArtwork}
          />
        }
      </StoryEditorContainer>
    );

  }
}

export default StoryEditorScreen;
