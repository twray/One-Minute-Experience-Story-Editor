import React from 'react';

import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { Artwork } from '../model/Artwork';

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
`;

const SidebarContainerInner = styled.div`
  height: 100vh;
  padding: 0 0;
  width: 100%;
  max-width: 400px;
  max-height: 820px;
  display: flex;
  flex-direction: column;
`;

const SidebarHeaderContainer = styled.div`
  height: 76.5px;
  width: 100%;
  display: flex;
  padding: 0 12px;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
`;

const SidebarHeader = styled.h2`
  margin: 0;
  color: #999999;
  padding: 0 0 18px 0;
  font-family: 'sf_compact_textmedium';
  position: relative;
`;

const AddIconButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: transparent;
  border-radius: 50%;
  position: absolute;
  top: -1px;
  right: 0;
  border: none;
  outline: none;
  cursor: pointer;
`

const SidebarBodyContainer = styled.div`
  height: 100vh;
  max-height: 667px;
  display: flex;
  flex-direction: column;
  flex: 1;
  border-top: 1px solid #CCCCCC;
  border-bottom: 1px solid #CCCCCC;
`

const ArtworkList = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

interface SidebarProps {
  artworks?: Artwork[];
  displayedArtwork?: Artwork;
  onArtworkSelect: (artwork: Artwork) => void;
  onArtworkAdd: () => void;
}

const Sidebar: React.FC<SidebarProps> = props => {
  const { artworks, displayedArtwork, onArtworkSelect, onArtworkAdd } = props;
  return (
    <SidebarContainer>
      <SidebarContainerInner>
        <SidebarHeaderContainer>
          <SidebarHeader>
            Stories
            <AddIconButton onClick={() => onArtworkAdd()}>
              <FontAwesomeIcon icon={faPlus} size="2x" color="#777777" />
            </AddIconButton>
          </SidebarHeader>
        </SidebarHeaderContainer>
        <SidebarBodyContainer>
          <ArtworkList>
            {artworks && artworks.map((artwork: Artwork) => {
              return (
                <ArtworkListItem
                  key={artwork.id || '+'}
                  artwork={artwork}
                  onSelect={onArtworkSelect}
                  selected={displayedArtwork
                    ? (artwork.id === displayedArtwork.id)
                    : false
                  }
                />
              )
            })}
          </ArtworkList>
        </SidebarBodyContainer>
      </SidebarContainerInner>
    </SidebarContainer>
  )
};

export default Sidebar;
