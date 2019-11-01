import React from 'react';

import styled from 'styled-components';

import { Artwork } from '../model/Artwork';

const PreviewImageContainer = styled.div`
  height: 100%;
  width: 25%;
  flex: 1;
  margin: 0 38px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PreviewImageContainerInner = styled.div`
  height: 100vh;
  max-height: 667px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const PreviewImageImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

interface PreviewImageProps {
  artwork?: Artwork;
};

const PreviewImage: React.FC<PreviewImageProps> = props => {
  const { artwork } = props;
  return (
    <PreviewImageContainer>
      <PreviewImageContainerInner>
        {artwork &&
          <PreviewImageImage src={artwork.image_url_with_aspect_ratio} alt={artwork.title} />
        }
      </PreviewImageContainerInner>
    </PreviewImageContainer>
  )
};

export default PreviewImage;
