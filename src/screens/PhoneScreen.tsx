import React from 'react';
import styled from 'styled-components';
import Carousel from '@brainhubeu/react-carousel';

const PhoneScreenContainer = styled.div`
  background-color: #F4F4F4;
  width: 100vw;
  height: 100vh;
  max-width: 375px;
  max-height: 667px;
  overflow: hidden;
`;

const CardContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 200px);
  max-width: 375px;
  max-height: 467px;
  margin-top: 100px;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: 80%;
  height: 100%;
  border-radius: 12px;
  background-color: #FFFFFF;
`;

const PhoneScreen: React.FC = () => {
  return (
    <PhoneScreenContainer>
      <Carousel>
        <CardContainer>
          <Card />
        </CardContainer>
        <CardContainer>
          <Card />
        </CardContainer>
        <CardContainer>
          <Card />
        </CardContainer>
        <CardContainer>
          <Card />
        </CardContainer>
        <CardContainer>
          <Card />
        </CardContainer>
        <CardContainer>
          <Card />
        </CardContainer>
      </Carousel>
    </PhoneScreenContainer>
  );
}

export default PhoneScreen;
