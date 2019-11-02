import React from 'react';

import styled from 'styled-components';

import { Artwork } from '../model/Artwork';

const ArtworkListItemContainer = styled.div`
  display: block;
  width: 100%;
  height: 96px;
  padding: 12px 0;
  font-size: 14px;
  line-height: 22px;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  color: #333333;
  cursor: pointer;
  &:hover, &.selected {
    background-color: #DFDFDF;
  }
`;

const ArtworkThumbnail = styled.img`
  display: block;
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 24px 0 12px;
`;

const ArtworkThumbnailPlaceholder = styled.div`
  display: block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 24px 0 12px;
  border: 1px dashed #777777;
`;

const ArtworkTitleAndArtist = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.p`
  font-family: 'sf_compact_textmedium';
  margin: 0;
`;

const Artist = styled.p`
  margin: 6px 0 0 0;
`;

interface ArtworkListItemProps {
  artwork: Artwork;
  onSelect: (artwork: Artwork) => void;
  selected: boolean;
};

const ArtworkListItem: React.FC<ArtworkListItemProps> = props => {
  const { artwork, onSelect, selected } = props;
  return (
    <ArtworkListItemContainer
      onClick={() => onSelect(artwork)}
      {...(selected && {className: 'selected'})}
    >
      {artwork.image_thumbnail_url
        ? <ArtworkThumbnail src={artwork.image_thumbnail_url} alt={artwork.title} />
        : <ArtworkThumbnailPlaceholder />
      }
      <ArtworkTitleAndArtist>
        <Title>{artwork.title || '(No Title)'}</Title>
        {artwork.artist_name && <Artist>{artwork.artist_name}</Artist>}
      </ArtworkTitleAndArtist>
    </ArtworkListItemContainer>
  );
}

export default ArtworkListItem;
