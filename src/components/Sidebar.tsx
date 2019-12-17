import React from 'react';

import styled from 'styled-components';
import classNames from 'classnames';

import { Artwork, ArtworkStatus } from '../model/Artwork';
import { UserRole } from '../model/User';

import AuthenticationService from '../services/AuthenticationService';

import ArtworkListItem from './ArtworkListItem';

const SidebarContainer = styled.div`
  height: 100%;
  width: 20%;
  min-width: 300px;
  margin: 0 0 0 38px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: #EFE6E7;
  z-index: 2;
  animation-name: appear-from-left-small-desktop-tablet;
  animation-iteration-count: 1;
  animation-duration: 0.3s;
  @media screen and (max-width: 1280px) {
    border-right: 1px solid #CCCCCC;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    margin-left: 0;
    width: 350px;
    &.hidden {
      display: none;
    }
  }
  @media screen and (max-width: 576px) {
    width: 100%;
  }
`;

const SidebarContainerInner = styled.div`
  height: 100vh;
  padding: 0;
  width: 100%;
  max-width: 400px;
  max-height: 820px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1280px) {
    max-height: none;
  }
  @media screen and (max-width: 576px) {
    max-width: none;
    height: 100%;
  }
`;

const SidebarHeaderContainer = styled.div`
  height: 76.5px;
  position: relative;
  display: flex;
  padding: 0 12px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  @media screen and (max-width: 1280px) {
    height: 72px;
  }
`;

const SidebarHeader = styled.h2`
  margin: 0;
  padding: 16px 0 0 0;
  color: #999999;
  font-family: 'sf_compact_textmedium';
  position: relative;
  @media screen and (max-width: 1280px) {
    padding: 0 0 0 48px;
  }
`;

const AddStory = styled.a`
  margin: 0;
  padding: 3px 0 0 0;
  position: absolute;
  right: 14px;
  color: #555555;
  margin-top: 10px;
  cursor: pointer;
  @media screen and (max-width: 1280px) {
    margin-top: 1px;
    right: 22px;
  }
`;

const SidebarBodyContainer = styled.div`
  height: 100vh;
  max-height: 667px;
  display: flex;
  flex-direction: column;
  flex: 1;
  border-top: 1px solid #CCCCCC;
  border-bottom: 1px solid #CCCCCC;
  position: relative;
  @media screen and (max-width: 1280px) {
    border-bottom: none;
    max-height: none;
  }
  @media screen and (max-width: 576px) {
    padding-bottom: 72px;
    height: auto;
  }
`

const ArtworkList = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const LogoutLink = styled.a`
  color: #FFFFFF !important;
  cursor: pointer;
  padding: 24px;
  background-color: #666666;
  font-family: 'sf_compact_textmedium';
  text-tranform: uppercase !important;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  &, &:hover {
    color: inherit;
    text-decoration: none;
  }
  display: none;
  @media screen and (max-width: 1280px) {
    display: block;
  }
`;

interface SidebarProps {
  artworks?: Artwork[];
  displayedArtwork?: Artwork;
  isHidden: boolean;
  onArtworkSelect: (artwork: Artwork) => void;
  onArtworkDelete: (artwork: Artwork) => void;
  onArtworkAdd: () => void;
  onLogoutButtonClick: () => void
}

const Sidebar: React.FC<SidebarProps> = props => {

  const {
    artworks,
    displayedArtwork,
    isHidden,
    onArtworkSelect,
    onArtworkDelete,
    onArtworkAdd,
    onLogoutButtonClick
  } = props;

  const artworksToSort = artworks != null ? artworks : [];

  const sortedArtworks: Artwork[] = [
    ...artworksToSort.filter((artwork: Artwork) => artwork.status === ArtworkStatus.New),
    ...artworksToSort.filter((artwork: Artwork) => !artwork.is_example && artwork.status !== ArtworkStatus.New),
    ...artworksToSort.filter((artwork: Artwork) => artwork.is_example && artwork.status !== ArtworkStatus.New)
  ];

  const sidebarClasses = classNames({
    'hidden': isHidden
  });

  return (
    <SidebarContainer className={sidebarClasses}>
      <SidebarContainerInner>
        <SidebarHeaderContainer>
          <SidebarHeader>
            Stories
          </SidebarHeader>
          {AuthenticationService.loggedInUser && AuthenticationService.loggedInUser.primary_role !== UserRole.ContentEditor &&
            <AddStory onClick={() => onArtworkAdd()}>
              Add New
            </AddStory>
          }
        </SidebarHeaderContainer>
        <SidebarBodyContainer>
          <ArtworkList>
            {sortedArtworks && sortedArtworks.map((artwork: Artwork) => {
              return (
                <ArtworkListItem
                  key={artwork.id || '+'}
                  artwork={artwork}
                  onSelect={onArtworkSelect}
                  onDelete={onArtworkDelete}
                  selected={displayedArtwork
                    ? (artwork.id === displayedArtwork.id)
                    : false
                  }
                />
              )
            })}
          </ArtworkList>
          <LogoutLink onClick={onLogoutButtonClick}>
            Log out
          </LogoutLink>
        </SidebarBodyContainer>
      </SidebarContainerInner>
    </SidebarContainer>
  )
};

export default Sidebar;
