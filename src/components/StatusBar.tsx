import React from 'react';

import styled from 'styled-components';

import AuthenticationService from '../services/AuthenticationService';

const StatusBarContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 72px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 40px;
  font-size: 14px;
  line-height: 20px;
  box-sizing: border-box;
  & > span {
    margin: 0 20px 0 0;
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
  onLogoutButtonClick: () => void;
};

const StatusBar: React.FC<StatusBarProps> = props => {
  const { message, error, onLogoutButtonClick } = props
  return (
    <StatusBarContainer>
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
    </StatusBarContainer>
  )
}

export default StatusBar;
