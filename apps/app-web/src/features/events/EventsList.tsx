import { FC } from 'react';
import styled from 'styled-components/macro';
import { Headline2, BodyM } from '@salutejs/plasma-b2c';
import { tertiary } from '@salutejs/plasma-tokens-b2c';

import { MEDIA_BREAKPOINTS } from 'zeep-platform-web/src/pageLayout';

import { useAppSelector } from '../../shared/hoos/redux';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  grid-column-gap: 16px;
  padding: 16px;

  ${MEDIA_BREAKPOINTS.l} {
    grid-template-columns: 1fr 1fr;
  }
`;

const EmptyTitle = styled(Headline2)`
  text-align: center;
  mathin-bottom: 12px;
`;

const EventCard = styled.div`
  border: 2px solid ${tertiary};
  border-radius: 8px;
`;

const EventLogo = styled.div`
  height: 150px;
  background: ${tertiary};

  > img {
    width: 100%;
    height: 100%;
  }
`;

const EventInfo = styled.div`
  display: flex;
  gap: 12px;
`;

export const EventsList: FC = () => {
  const events = useAppSelector(state => state.events.events);

  return (
    <>
      {!events.length && (
        <EmptyTitle>Нажмите на кнопку "поиск" для вывода ближайших событий</EmptyTitle>
      )}
      <Wrapper>
        {events.map((event) => (
          <EventCard key={event.id}>
            <EventLogo>
              {event.organization.poster && (
                <img src={event.organization.poster} />
              )}
            </EventLogo>
            <BodyM>{event.title}</BodyM>
            <EventInfo>
              <div>
                <BodyM>Дата начала: {event.startDate}</BodyM>
                <BodyM>Дата конца: {event.endDate}</BodyM>
              </div>
              <div></div>
            </EventInfo>
          </EventCard>
        ))}
      </Wrapper>
    </>
  )
}