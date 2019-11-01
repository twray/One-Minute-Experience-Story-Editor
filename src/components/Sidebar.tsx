import React from 'react';

import styled from 'styled-components';

const SidebarContainer = styled.div`
  height: 100%;
  width: 20%;
  min-width: 300px;
  margin: 0 0 0 38px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const SidebarContainerInner = styled.div`
  height: 100vh;
  max-height: 705px;
  padding: 19px 0;
  width: 100%;
  max-width: 400px;
`;

const Sidebar: React.FC = () => (
  <SidebarContainer>
    <SidebarContainerInner>
      <h1 style={{color: '#999999', fontFamily: 'sf_compact_textmedium'}}>Artworks</h1>
    </SidebarContainerInner>
  </SidebarContainer>
);

export default Sidebar;
