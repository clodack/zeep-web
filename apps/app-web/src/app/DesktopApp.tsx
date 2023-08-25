import { FC } from 'react';
import styled from 'styled-components/macro';
import { IconApps } from '@salutejs/plasma-icons';
import { Button } from '@salutejs/plasma-b2c';
import { tertiary } from '@salutejs/plasma-tokens-b2c';

import { AppsModal } from '../shared/components/AppsModal';
import { MapWrapper } from '../shared/components/MapWrapper';
import { useGlobalContext } from '../shared/contexts/globalContext';

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const MainContentWrapper = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
`;

const StyledAction = styled(Button)`
  border: 1px solid ${tertiary};
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
`;

export const DesktopApp: FC = () => {
  const { eventBus } = useGlobalContext();

  return (
    <Wrapper>
      <MainContentWrapper>
        <MapWrapper />
      </MainContentWrapper>
      <StyledAction
        contentLeft={<IconApps />}
        onClick={() => eventBus({ type: 'togleAppsModal' })}
      />
      <AppsModal />
    </Wrapper>
  );
}
