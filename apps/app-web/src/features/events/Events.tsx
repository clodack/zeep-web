import { FC } from 'react';
import styled from 'styled-components/macro';
import { IconClose } from '@salutejs/plasma-icons';
import { Button, H2 } from '@salutejs/plasma-b2c';
import { background } from '@salutejs/plasma-tokens-b2c';

import { SearchForm } from './SearchForm';

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

      <SearchForm />
    </Wrapper>
  );
}
