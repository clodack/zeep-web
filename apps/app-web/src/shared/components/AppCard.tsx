import { FC } from 'react';
import { Headline2, BodyM } from '@salutejs/plasma-b2c';
import { tertiary } from '@salutejs/plasma-tokens-b2c';

import styled from 'styled-components/macro';

export type AppCardProps = {
  titile: string;
  description: string;
  onClick: () => void;
};

const Wrapper = styled.div`
  width: 470px;
  max-width: 30vw;
  border-radius: 12px;
  border: 2px solid ${tertiary};
  background: linear-gradient(45deg, #f5f7fa, #c3cfe2);
  padding: 12px;
  box-sizing: border-box;
  cursor: pointer;
`;

const Title = styled(Headline2)`
  text-align: center;
  max-width: 80%;
  display: -webkit-box;
  -webkit-line-clamp: 2; // количество строк
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 22px;
  font-size: 16px;
`;

const Description = styled(BodyM)`
  text-align: center;
  max-width: 80%;
  display: -webkit-box;
  -webkit-line-clamp: 2; // количество строк
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const AppCard: FC<AppCardProps> = ({
  titile,
  description,
  onClick,
}) => {
  return (
    <Wrapper onClick={onClick}>
      <Title>{ titile }</Title>
      <Description>{ description }</Description>
    </Wrapper>
  )
}