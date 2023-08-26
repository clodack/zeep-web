import { FC, useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { H2 } from '@salutejs/plasma-b2c';
import { backgroundPrimary } from '@salutejs/plasma-tokens-b2c';
import { handleEvent } from 'zeep-common/src/query';

import { useGlobalContext } from '../contexts/globalContext';
import { Events } from '../../features/events';

import { AppCard } from './AppCard';

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
  const { event$ } = useGlobalContext();
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const [isOpoenEvents, setIsOpenEvents] = useState(false);

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