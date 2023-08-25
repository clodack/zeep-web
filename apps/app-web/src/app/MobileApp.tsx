import { FC } from 'react';
import { background, tertiary } from '@salutejs/plasma-tokens-b2c';
import styled from 'styled-components/macro';

import { MapWrapper } from '../shared/components/MapWrapper';
import { MobileActions } from '../shared/components/MobileActions';

const Wrapper = styled.div`
  position: relative;
`;

const Actions = styled.div`
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  gap: 16px;
  background: ${background};
  border-top: 1px solid ${tertiary};
`;

const MainContentWrapper = styled.div`
  height: calc(100vh - 64px);
  position: relative;
`;

export const MobileApp: FC = () => {
  return (
    <Wrapper>
      <MainContentWrapper>
        <MapWrapper />
      </MainContentWrapper>
      <Actions>
        <MobileActions />
      </Actions>
    </Wrapper>
  );
}
