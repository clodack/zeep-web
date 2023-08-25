import { FC, useCallback } from 'react';
import styled from 'styled-components/macro';
import { IconClose } from '@salutejs/plasma-icons';
import { Button, H2 } from '@salutejs/plasma-b2c';
import { background } from '@salutejs/plasma-tokens-b2c';

import { createSearchParams } from 'zeep-common/src/httpClient';
import { getPlatformModule } from 'zeep-sdk-core/src';

import { useGlobalContext } from '../../shared/contexts/globalContext';
import { useAppDispatch } from '../../shared/hoos/redux';

import { SearchForm } from './SearchForm';
import { EventsList } from './EventsList';
import { Filters } from './utils';
import { setEvents } from './eventsSlize';
import { EventsResponse } from './types';

const StyledClose = styled(Button)`
  position: absolute;
  right: 12px;
  top: 12px;
`;

const Wrapper = styled.div`
  transition: .5s;
  background: ${background};
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 12px 18px;
  z-index: 20;
  overflow-Y: auto;
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

export type EventsProps = {
  isOpen: boolean;
  onClose: () => void;
}

export const Events: FC<EventsProps> = ({
  isOpen,
  onClose,
}) => {
  const { sdk } = useGlobalContext();

  const dispatch = useAppDispatch();

  const handleSearch = useCallback((filters: Filters) => {
    if (!sdk || !process.env.ZEEP_APP_EVENTS_URL) return;

    const filtersString = createSearchParams(filters);

    const { httpClient } = getPlatformModule(sdk);
    
    httpClient.get<EventsResponse>({
      url: `${process.env.ZEEP_APP_EVENTS_URL}/list?${filtersString}`
    }).subscribe((next) => {
      dispatch(setEvents(next.data.list || []))
    })
  }, [sdk, dispatch]);

  if (!isOpen) return;

  return (
    <Wrapper>
      <TitleWrapper>
        <StyledClose
          contentLeft={<IconClose />}
          view="clear"
          onClick={() => onClose()}
        />
        <Title>Сервис событий</Title>
      </TitleWrapper>

      <SearchForm onSearch={handleSearch} />
      <EventsList />
    </Wrapper>
  );
}
