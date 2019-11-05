import React from 'react';

import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import AuthenticationService from '../services/AuthenticationService';

import { Artwork } from '../model/Artwork';

const StatusBarContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 40px;
  font-size: 14px;
  line-height: 20px;
  z-index: 3;
  box-sizing: border-box;
  & > span {
    margin: 0 20px 0 0;
  }
  @media screen and (max-width: 1280px) {
    left: 0;
    width: 72px;
  }
`;

const StatusBarRight = styled.div`
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 1280px) {
    display: none;
  }
`;

const StatusBarLeft = styled.div`
  position: absolute;
  width: 72px;
  top: 0;
  bottom: 0;
  left: 0;
`;

const SideBarToggleButton = styled.button`
  width: 100%;
  height: 100%;
  outline: none;
  background: transparent;
  border: none;
  cursor: pointer;
  display: none;
  @media screen and (max-width: 1280px) {
    display: block;
  }
  @media screen and (min-width: 577px) {
    & svg {
      color: #777777 !important;
    }
  }
`;

const StatusBarText = styled.span`
  display: block;
  color: #666666;
`;

const StatusBarError = styled.span`
  display: block;
  color: #EE5E54;
  font-family: 'sf_compact_textmedium';
  margin-right: 40px !important;
`;

const StatusBarNotification = styled.span`
  display: block;
  color: #999999;
  margin-right: 40px !important;
`;

const StatusBarLink = styled.a`
  color: #444444;
  cursor: pointer;
  &, &:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const StatusBarLoggedInUsername = styled.span`
  color: #444444;
  margin: 0 7.5px;
  font-family: 'sf_compact_textmedium';
`;

interface StatusBarProps {
  message?: string;
  error?: string;
  sidebarIsHidden: boolean;
  displayedArtwork: Artwork|null;
  onLogoutButtonClick: () => void;
  onHamburgerMenuClick: () => void;
};

const StatusBar: React.FC<StatusBarProps> = props => {
  const {
    message,
    error,
    sidebarIsHidden,
    displayedArtwork,
    onLogoutButtonClick,
    onHamburgerMenuClick
  } = props;
  return (
    <StatusBarContainer>
      <StatusBarLeft>
        <SideBarToggleButton onClick={onHamburgerMenuClick}>
          {sidebarIsHidden &&
            <FontAwesomeIcon
              icon={faBars}
              size="2x"
              color={(displayedArtwork && displayedArtwork.image_url) ? '#FFFFFF' : '#777777'}
            />
          }
          {!sidebarIsHidden &&
            <FontAwesomeIcon
              icon={faTimes}
              size="2x"
              color="#777777"
            />
          }
        </SideBarToggleButton>
      </StatusBarLeft>
      <StatusBarRight>
        {message && <StatusBarNotification>{message}</StatusBarNotification>}
        {error && <StatusBarError>{error}</StatusBarError>}
        {AuthenticationService.token && AuthenticationService.loggedInUser &&
          <StatusBarText>
            Logged in as:
            <StatusBarLoggedInUsername>
              {AuthenticationService.loggedInUser.email}
            </StatusBarLoggedInUsername>
          </StatusBarText>
        }
        <StatusBarLink onClick={onLogoutButtonClick}>Log out</StatusBarLink>
      </StatusBarRight>
    </StatusBarContainer>
  )
}

export default StatusBar;
