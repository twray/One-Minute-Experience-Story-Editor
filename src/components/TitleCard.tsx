import React, { ChangeEvent, RefObject, createRef } from 'react';

import styled from 'styled-components';

import { Card } from './Card';
import Button from './Button';
import SingleLineInput from './SingleLineInput';

import ArtworkService from '../services/ArtworkService';

import {
  Artwork,
  UserUpdatableArtworkMetadata
} from '../model/Artwork';

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
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageFilePicker = styled.input`
  display: none;
`

interface TitleCardProps {
  artwork: Artwork;
  onChange: (artwork: Artwork) => void;
};

interface TitleCardState {};

class TitleCard extends React.Component<
  TitleCardProps,
  TitleCardState
> {

  artworkService: ArtworkService = new ArtworkService();

  updateArtworkField = (field: UserUpdatableArtworkMetadata, value: string) => {
    const updatedArtwork: Artwork = {...this.props.artwork};
    updatedArtwork[field] = value;
    this.props.onChange(updatedArtwork);
  }

  handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const imageFile: File = e.target.files[0];
        const imageFilename: string = imageFile.name;
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        const fileData: string|ArrayBuffer|null = await new Promise((resolve, reject) => { 
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject();
        });
        if (typeof fileData === 'string') {
          this.updateArtworkField('image_url', fileData);
          this.artworkService.updateArtworkImage(this.props.artwork, imageFile, imageFilename);
        }
      } catch (e) {
        console.log('A problem occurred while loading the image file.');
        console.log(e);
      }
    }
  }

  render() {
    const { artwork } = this.props;
    const imageFilePickerRef: RefObject<HTMLInputElement> = createRef<HTMLInputElement>();
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
          <Button
            buttonStyle="white-transparent"
            buttonSize="md"
            text={
              !artwork.image_url
                ? 'Add Photo ...'
                : 'Change Photo ...'
            }
            onClick={() => imageFilePickerRef.current && imageFilePickerRef.current.click()}
          />
          <ImageFilePicker
            ref={imageFilePickerRef}
            type="file"
            accept="image/*"
            onChange={this.handleImageSelect}
          />
        </ArtworkImagePicker>
      </Card>
    )
  }
}

export default TitleCard;
