import React from 'react';
import styled from 'styled-components';

import PhoneScreen from '../screens/PhoneScreen';

import phoneShellImg from '../assets/images/phone-shell.svg';

const PhoneContainer = styled.div`
  width: 410px;
  height: 820px;
  background-image: url(${phoneShellImg});
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Phone: React.FC = () => {
  return (
    <PhoneContainer>
      <PhoneScreen />
    </PhoneContainer>
  )
}

export default Phone;
