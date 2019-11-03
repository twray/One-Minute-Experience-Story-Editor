import React, { MouseEvent } from 'react';

import styled from 'styled-components';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import AuthenticationService from '../services/AuthenticationService';

import { Artwork } from '../model/Artwork';

const ArtworkListItemContainer = styled.div`
  display: block;
  width: 100%;
  height: 96px;
  padding: 0 12px 0 0;
  font-size: 14px;
  line-height: 22px;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  color: #333333;
  cursor: pointer;
  position: relative;
  &:hover, &.selected {
    background-color: #DFDFDF;
    .delete-icon-button {
      display: block;
    }
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
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 200px;
  &.truncated {
    max-width: 150px;
  }
`;

const ExampleText = styled.label`
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: block;
  font-family: 'sf_compact_textmedium';
  font-size: 12px;
  line-height: 18px;
  text-transform: uppercase;
  color: #999999;
`;

const DeleteIconButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  display: none;
  width: 30px;
  height: 30px;
  padding: 0;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
  & svg {
    width: 16px !important;
    height: 16px !important;
  }
`;

interface ArtworkListItemProps {
  artwork: Artwork;
  onSelect: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
  selected: boolean;
};

const ArtworkListItem: React.FC<ArtworkListItemProps> = props => {

  const { artwork, onSelect, onDelete, selected } = props;

  const artworkListItemContainerClasses = classNames({
    'selected': selected
  });

  const artistClasses = classNames({
    'truncated': artwork.is_example,
  });

  return (
    <ArtworkListItemContainer
      className={artworkListItemContainerClasses}
      onClick={() => onSelect(artwork)}
    >
      {artwork.image_thumbnail_url
        ? <ArtworkThumbnail src={artwork.image_thumbnail_url} alt={artwork.title} />
        : <ArtworkThumbnailPlaceholder />
      }
      <ArtworkTitleAndArtist>
        <Title>{artwork.title || '(No Title)'}</Title>
        {artwork.artist_name &&
          <Artist className={artistClasses}>{artwork.artist_name}</Artist>
        }
      </ArtworkTitleAndArtist>
      {!artwork.is_example &&
        AuthenticationService.loggedInUser &&
        AuthenticationService.loggedInUser.id === artwork.created_by_user_id &&
        <DeleteIconButton
          className="delete-icon-button"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onDelete(artwork)
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} size="1x" color="#EE5E54" />
        </DeleteIconButton>
      }
      {artwork.is_example && <ExampleText>Example</ExampleText>}
    </ArtworkListItemContainer>
  );
}

export default ArtworkListItem;
