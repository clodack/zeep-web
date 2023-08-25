import { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import {
  DropdownItemProps,
  Headline3,
  Select,
  Button,
} from '@salutejs/plasma-b2c';
import { tertiary } from '@salutejs/plasma-tokens-b2c';

import { useGlobalContext } from '../../shared/contexts/globalContext';
import { useAppDispatch, useAppSelector } from '../../shared/hoos/redux';

import { setCategories, setConfigs } from './eventsSlize';
import { Categories, Configs } from './types';
import { getPlatformModule } from 'zeep-sdk-core/src';

const Wrapper = styled.div`
  border: 2px solid ${tertiary};
  border-radius: 20px;
  padding: 12px;
  box-sizing: border-box;
  max-width: 100%;
`;

const Title = styled(Headline3)`
  margin-bottom: 12px;
`

const FormSelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
`;

const FormSelectWrapperActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
`;

export const SearchForm: FC = () => {
  const { sdk } = useGlobalContext();
  
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.events.categories);
  const configs = useAppSelector((state) => state.events.configs);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>(undefined);
  const [selectedPrices, setSelecterdPrices] = useState<number | undefined>(undefined);

  const vueCategories = useMemo<DropdownItemProps[]>(() => {
    if (!categories) return [];

    return categories.map((category, index) => ({
      index,
      label: category.title,
      value: category.id,
    }))
  }, [categories]);

  const vueRegions = useMemo<DropdownItemProps[]>(() => {
    if (!configs?.dictionaries) return [];

    return configs.dictionaries.filterCities.map((city, index) => ({
      index,
      label: city.title,
      value: city.id,
    }))
  }, [configs]);

  const vuePrices = useMemo<DropdownItemProps[]>(() => {
    if (!configs?.dictionaries) return [];

    return configs.dictionaries.filterPrices.map((price, index) => ({
      index,
      label: price.title,
      value: price.id,
    }))
  }, [configs]);

  useEffect(() => {
    if (!sdk || categories) return;

    const { httpClient } = getPlatformModule(sdk);

    httpClient.get<Categories>({
      url: `${process.env.ZEEP_APP_EVENTS_URL}/categories`
    })
    .subscribe(async (next) => {
      dispatch(setCategories(next.data || []));
    })
  }, [sdk, categories, dispatch]);

  useEffect(() => {
    if (!sdk || configs) return;

    const { httpClient } = getPlatformModule(sdk);

    httpClient.get<Configs>({
      url: `${process.env.ZEEP_APP_EVENTS_URL}/config`
    })
    .subscribe(async (next) => {
      dispatch(setConfigs(next.data));
    })
  }, [sdk, configs, dispatch]);

  return (
    <Wrapper>
      <Title>Форма поиска</Title>
      <FormSelectWrapper>
        <Select
          multiselect
          items={vueCategories}
          value={selectedCategories}
          onChange={(ids) => setSelectedCategories(ids)}
          title="Выберете одну или несколько категорий"
          placeholder="Выберете одну или несколько категорий"
        />
        <Select
          items={vueRegions}
          value={selectedRegion}
          onChange={(id) => setSelectedRegion(id)}
          title="Выберете регион"
          placeholder="Выберете регион"
        />
      </FormSelectWrapper>
      <FormSelectWrapperActions>
        <Select
          items={vuePrices}
          value={selectedPrices}
          onChange={(id) => setSelecterdPrices(id)}
          title="Выберете стоимость"
          placeholder="Выберете стоимость"
        />
        <Button view="primary">Найти</Button>
        <Button view="clear">очтистить поиск</Button>
      </FormSelectWrapperActions>
    </Wrapper>
  );
}
