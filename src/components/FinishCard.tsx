import React from 'react';

import styled from 'styled-components';

import { Card } from './Card';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck  } from '@fortawesome/free-solid-svg-icons';

const FinishCardSection = styled.figure`
  margin: 0;
  padding: 10%;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  figcpation {
    margin: 0;
    padding: 0;
  }
  p, svg {
    margin-bottom: 10px;
  }
`;

const FinishCard: React.FC = () => (
  <Card>
    <FinishCardSection>
      <FontAwesomeIcon icon={faCheck} size="4x" color="#444444" />
      <p><strong>Your story is now published.</strong></p>
      <p>Visitors can now use the One Minute App to scan the artwork and read this story.</p>
    </FinishCardSection>
  </Card>
)

export default FinishCard;
