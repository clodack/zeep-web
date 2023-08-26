import { FC } from 'react';
import { background, tertiary } from '@salutejs/plasma-tokens-b2c';
import styled from 'styled-components/macro';

import { MapWrapper } from '../shared/components/MapWrapper';
import { MobileActions } from '../shared/components/MobileActions';
import { AppsModal } from '../shared/components/AppsModal';
import { VideoElement } from '../shared/components/Video';
import { Media } from '../shared/components/Media';

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  padding: 16px 8px;
  gap: 16px;
  background: ${background};
  border-right: 1px solid ${tertiary};
`;

const MainContentWrapper = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
`;

export const TabletApp: FC = () => {
  return (
    <Wrapper>
      <Actions>
        <MobileActions />
      </Actions>
      <MainContentWrapper>
        <MapWrapper />
        <VideoElement />
        <Media />
      </MainContentWrapper>
      <AppsModal />
    </Wrapper>
  );
}
