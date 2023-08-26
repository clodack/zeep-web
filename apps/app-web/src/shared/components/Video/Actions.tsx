import { FC } from 'react';
import styled from 'styled-components/macro';
import { Button } from '@salutejs/plasma-b2c';
import { white } from '@salutejs/plasma-tokens-b2c';

const Wrapper = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 24px;
  left: 50vw;
  transform: translateX(-50%);
`;

const Action = styled(Button)`
  background: ${white};
  width: 94px;
  height: 94px;
  border-radius: 50%;
  outline: 2px dashed #3d1f15;
  outline-offset: -10px;

  &:active,
  &:hover,
  &:focus {
    outline: 2px dashed #3d1f15;
    outline-offset: -10px;
  }
`

export const Actions: FC = () => {
  return (
    <Wrapper>
      <Action
        pin="circle-circle"
      />
    </Wrapper>
  )
}