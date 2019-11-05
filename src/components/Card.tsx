import styled from 'styled-components';

export const CardContainer = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  max-width: 375px;
  max-height: 467px;
  margin-top: 100px;
  display: flex;
  justify-content: center;
  @media screen and (max-width: 576px) {
    max-width: none;
    width: 100vw;
    margin-top: 50px;
  }
`;

export const Card = styled.div`
  position: relative;
  width: 80%;
  height: 100%;
  border-radius: 12px;
  background-color: #FFFFFF;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
