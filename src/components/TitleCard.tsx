import React, { ChangeEvent } from 'react';

import styled from 'styled-components';

import { Card } from './Card';
import SingleLineInput from './SingleLineInput';

import { Artwork, UserUpdatableArtworkMetadata } from '../model/Artwork';

const ArtworkInfoForm = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px 18px 0 18px;;
`;

const ArtworkImagePicker = styled.div`
  flex: 1;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-color: #DDDDDD;
`;

interface TitleCardProps {
  artwork: Artwork;
  onChange: (artwork: Artwork) => void
};

interface TitleCardState {};

class TitleCard extends React.Component<
  TitleCardProps,
  TitleCardState
> {

  updateArtworkField = (field: UserUpdatableArtworkMetadata, value: string) => {
    const updatedArtwork: Artwork = {...this.props.artwork};
    updatedArtwork[field] = value;
    this.props.onChange(updatedArtwork);
  }

  render() {
    const { artwork } = this.props;
    return (
      <Card>
        <ArtworkInfoForm>
          <SingleLineInput
            label="Title"
            value={artwork.title}
            placeholder="e.g. Queen’s Park, Brighton"
            onChange={(e: ChangeEvent<HTMLInputElement>) => { 
              this.updateArtworkField('title', e.target.value)
            }}
          />
          <SingleLineInput
            label="Year"
            value={artwork.year}
            placeholder="e.g. 1835"
            isOptional
            onChange={(e: ChangeEvent<HTMLInputElement>) => { 
              this.updateArtworkField('year', e.target.value)
            }}
          />
          <SingleLineInput
            label="Artist"
            value={artwork.artist_name}
            placeholder="e.g. Thomas Allom"
            isOptional
            onChange={(e: ChangeEvent<HTMLInputElement>) => { 
              this.updateArtworkField('artist_name', e.target.value)
            }}
          />
          <SingleLineInput
            label="Artist Nationality"
            value={artwork.artist_nationality}
            placeholder="e.g. Dutch"
            isOptional
            onChange={(e: ChangeEvent<HTMLInputElement>) => { 
              this.updateArtworkField('artist_nationality', e.target.value)
            }}
          />
        </ArtworkInfoForm>
        <ArtworkImagePicker
          style={{backgroundImage: `url('${artwork.image_url}')`}}
        >
        </ArtworkImagePicker>
      </Card>
    )
  }
}

export default TitleCard;
