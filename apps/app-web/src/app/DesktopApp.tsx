import { FC } from 'react';
import { Headline2 } from '@salutejs/plasma-b2c';
import { background, tertiary } from '@salutejs/plasma-tokens-b2c';
import styled from 'styled-components/macro';

import { MapWrapper } from '../shared/components/MapWrapper';

const Title = styled(Headline2)`
  text-align: center;
  margin-top: 32px;
  margin-bottom: 16px;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const Services = styled.div`
  width: 500px;
  height: 100vh;
  background: ${background};
  border-right: 2px solid ${tertiary};
`;

const MainContentWrapper = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
`;

export const DesktopApp: FC = () => {
  return (
    <Wrapper>
      <Services>
        <Title>Сервисы</Title>
      </Services>
      <MainContentWrapper>
        <MapWrapper />
      </MainContentWrapper>
    </Wrapper>
  );
}
