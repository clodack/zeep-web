import { FC, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Headline2, TextField } from '@salutejs/plasma-b2c';
import { IconSearch } from '@salutejs/plasma-icons';
import { backgroundPrimary } from '@salutejs/plasma-tokens-b2c';
import { handleEvent } from 'zeep-common/src/query';

import { useGlobalContext } from '../../contexts/globalContext';

const Wrapper = styled.div<{
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

const Title = styled(Headline2)`
  margin: 16px 0;
  text-align: center;
`;

export const Media: FC = () => {
  const { event$ } = useGlobalContext();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = handleEvent(event$, 'toggleReelse', ({ payload }) => {
      setIsOpen(payload.isOpen);
    });

    return () => {
      unsubscribe();
    }
  }, [event$]);

  return (
    <Wrapper data-visible={isOpen || undefined}>
      <Title>Лента</Title>
      <TextField
        placeholder="Что вы ищете"
        contentRight={<IconSearch />}
      />
    </Wrapper>
  );
}