import { FC, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { IconClose } from '@salutejs/plasma-icons';
import { Button, H2 } from '@salutejs/plasma-b2c';
import { backgroundPrimary } from '@salutejs/plasma-tokens-b2c';
import { handleEvent, handleQueryChanges } from 'zeep-common/src/query';

import { useGlobalContext } from '../contexts/globalContext';
import { Events } from '../../features/events';

import { AppCard } from './AppCard';
import { getIsDesktop } from 'zeep-sdk-core/src';

const AppsList = styled.div<{
  'data-visible'?: boolean;
}>`
  height: 100%;
  width: 100%;
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  background: ${backgroundPrimary};
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
  padding: 0 12px;
  box-sizing: border-box;

  &[data-visible] {
    display: block;
  }
`;

const TitleWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledClose = styled(Button)`
  position: absolute;
  right: 12px;
  top: 12px;
`;

const Title = styled(H2)`
  margin: 16px 0 32px 0;
`;

const Services = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  grid-column-gap: 16px;
  padding: 16px;
  box-sizing: border-box;
`;

export const AppsModal: FC = () => {
  const { event$, sdk } = useGlobalContext();
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const [isOpoenEvents, setIsOpenEvents] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (!sdk) return;

    const isDesktop = getIsDesktop(sdk);

    setIsDesktop(isDesktop.get());

    const unsubscribe = handleQueryChanges(isDesktop, (isDesktop) => {
      setIsDesktop(isDesktop);
    });

    return () => {
      unsubscribe();
    }
  }, [sdk]);

  useEffect(() => {
    const unsubscribe = handleEvent(event$, 'togleAppsModal', ({ payload }) => {
      setIsOpenMenu(payload.isOpen);
    });

    return () => {
      unsubscribe();
    }
  }, [event$]);

  return (
    <AppsList data-visible={isOpenMenu || undefined}>
      <TitleWrapper>
        {isDesktop && (
          <StyledClose
            contentLeft={<IconClose />}
            view="clear"
            onClick={() => setIsOpenMenu(false)}
          />
        )}
        <Title>Сервисы</Title>
      </TitleWrapper>
      <Services>
        <AppCard
          titile='Ближайшие мероприятия'
          description="Выберите как пароверсти свое время с пользой"
          onClick={() => setIsOpenEvents(true)}
        />
      </Services>
      <Events
        isOpen={isOpoenEvents}
        onClose={() => setIsOpenEvents(false)}
      />
    </AppsList>
  );
}