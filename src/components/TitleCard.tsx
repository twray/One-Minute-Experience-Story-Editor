import React, { ChangeEvent, RefObject, createRef } from 'react';

import styled from 'styled-components';
import loadImage from 'blueimp-load-image';

import { Card } from './Card';
import Button from './Button';
import SingleLineInput from './SingleLineInput';

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
const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(40, 40, 40, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

const LoadingText = styled.div`
  color: #FFFFFF;
  font-family: 'sf_compact_textmedium';
  text-align: center;
`;

interface TitleCardProps {
  artwork: Artwork;
  isProcessing: boolean;
  onChange: (artwork: Artwork) => void;
  onImageSelect: (artwork: Artwork, imageFile: File, imageFilename: string) => void;
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

  handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        let imageFile: File = e.target.files[0];
        const imageFilename: string = imageFile.name;
        try {
          // Can we find EXIF data?
          loadImage(imageFile, (img, data) => console.log(data), {meta: true, orientation: true});
          // If possible, try and correct the image rotation if taken from the phone
          const correctedImage: HTMLCanvasElement|HTMLImageElement = await new Promise(resolve => loadImage(imageFile, img => resolve(img), {orientation: true}));
          const correctedImageCanvas: HTMLCanvasElement = (correctedImage as HTMLCanvasElement);
          const correctedImageBlob: Blob = await new Promise(resolve => correctedImageCanvas.toBlob(blob => resolve((blob as File)), 'image/jpeg', 0.8));
          const correctedImageFile: File = new File([correctedImageBlob], imageFile.name, {type: imageFile.type});
          imageFile = correctedImageFile;
        } catch {
          console.log('An error occurred while parsing EXIF data from the image.');
          console.log(e);
        }
        this.props.onImageSelect(this.props.artwork, imageFile, imageFilename);
      } catch (e) {
        console.log('A problem occurred while loading the image file.');
        console.log(e);
      }
    }
  }

  render() {
    const { artwork, isProcessing } = this.props;
    const imageFilePickerRef: RefObject<HTMLInputElement> = createRef<HTMLInputElement>();
    return (
      <Card>
        <ArtworkInfoForm>
          <SingleLineInput
            label="Title"
            value={artwork.title}
            placeholder="e.g. Queen’s Park, Brighton"
            disabled={isProcessing}
            readOnly={artwork.is_example}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { 
              this.updateArtworkField('title', e.target.value)
            }}
          />
          <SingleLineInput
            label="Artist"
            value={artwork.artist_name}
            placeholder="e.g. Thomas Allom"
            isOptional
            disabled={isProcessing}
            readOnly={artwork.is_example}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { 
              this.updateArtworkField('artist_name', e.target.value)
            }}
          />
          <SingleLineInput
            label="Year"
            value={artwork.year}
            placeholder="e.g. 1835"
            isOptional
            disabled={isProcessing}
            readOnly={artwork.is_example}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { 
              this.updateArtworkField('year', e.target.value)
            }}
          />
          <SingleLineInput
            label="Artist Nationality"
            value={artwork.artist_nationality}
            placeholder="e.g. Dutch"
            isOptional
            disabled={isProcessing}
            readOnly={artwork.is_example}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { 
              this.updateArtworkField('artist_nationality', e.target.value)
            }}
          />
        </ArtworkInfoForm>
        <ArtworkImagePicker
          style={{backgroundImage: `url('${artwork.image_url}')`}}
        >
          {!artwork.is_example &&
            <React.Fragment>
              <Button
                buttonStyle="white-transparent"
                buttonSize="md"
                text={
                  !artwork.image_url
                    ? (window.innerWidth > 576 ? 'Add Photo ...' : 'Take Photo ...')
                    : (window.innerWidth <= 576 ? 'Change Photo ...' : 'Change Photo ...')
                }
                disabled={isProcessing}
                onClick={() => imageFilePickerRef.current && imageFilePickerRef.current.click()}
              />
              <ImageFilePicker
                ref={imageFilePickerRef}
                type="file"
                accept="image/*"
                capture="camera"
                onChange={this.handleImageSelect}
              />
            </React.Fragment>
          }
        </ArtworkImagePicker>
        {isProcessing &&
          <LoadingContainer>
            <LoadingText>
              <p>Processing image ...</p>
              <p>This may take up to a minute.</p>
            </LoadingText>
          </LoadingContainer>
        }
      </Card>
    )
  }
}

export default TitleCard;
