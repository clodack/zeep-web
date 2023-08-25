import {
  FC,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import styled from 'styled-components/macro';
import {
  Calendar,
  DropdownItemProps,
  Headline3,
  Select,
  Button,
  Popup,
  TextField,
} from '@salutejs/plasma-b2c';
import { backgroundPrimary, tertiary } from '@salutejs/plasma-tokens-b2c';

import { MEDIA_BREAKPOINTS } from 'zeep-platform-web/src/pageLayout';

import { useGlobalContext } from '../../shared/contexts/globalContext';
import { useAppDispatch, useAppSelector } from '../../shared/hoos/redux';

import { setCategories, setConfigs } from './eventsSlize';
import { Categories, Configs } from './types';
import { getPlatformModule } from 'zeep-sdk-core/src';

import { getFilters, Filters } from './utils';

const Wrapper = styled.div`
  border: 2px solid ${tertiary};
  border-radius: 20px;
  padding: 12px;
  box-sizing: border-box;
  max-width: 100%;
  margin-bottom: 32px;
`;

const Title = styled(Headline3)`
  margin-bottom: 12px;
  text-align: center;

  ${MEDIA_BREAKPOINTS.l} {
    text-align: left;
  }
`

const FormSelectWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;

  ${MEDIA_BREAKPOINTS.l} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const StyledCalendar = styled(Calendar)`
    background-color: ${backgroundPrimary};
    box-shadow: 0 0.063rem 0.25rem -0.063rem rgba(0, 0, 0, 0.04),
      0 0.375rem 0.75rem -0.125rem rgba(8, 8, 8, 0.1);
    border-radius: 0.75rem;
`;

export type SearchFormProps = {
  onSearch: (filters: Filters) => void;
}

export const SearchForm: FC<SearchFormProps> = ({ onSearch }) => {
  const { sdk } = useGlobalContext();
  
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.events.categories);
  const configs = useAppSelector((state) => state.events.configs);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>(undefined);
  const [selectedPrices, setSelecterdPrices] = useState<number | undefined>(undefined);
  const [seletedDate, setSeletedDate] = useState<[Date, Date?]>([new Date(), undefined]);

  const [isOpenCalendar, setIsOpenCalendar] = useState(false);

  const handleClear = useCallback(() => {
    setSelectedCategories([]);
    setSelectedRegion(undefined);
    setSelecterdPrices(undefined);
    setSeletedDate([new Date(), undefined]);
  }, []);

  const handleSerch = useCallback(() => {
    const range = configs?.dictionaries.filterPrices.find((item) => item.id === selectedPrices);

    const filters = getFilters({
      dates: seletedDate,
      selectedCategories,
      selectedRegion,
      range: range?.range ?? undefined,
    });

    onSearch(filters);
  }, [
    seletedDate,
    selectedCategories,
    selectedRegion,
    selectedPrices,
    configs,
    onSearch,
  ]);

  const dataText = useMemo(() => {
    const date1 = seletedDate[0];
    const text1 = `${date1.getDay()}.${date1.getMonth()}.${date1.getFullYear()}`;

    if (!seletedDate[1]) {
      return text1;
    }

    const date2 = seletedDate[1];
    const text2 = `${date2.getDay()}.${date2.getMonth()}.${date2.getFullYear()}`;

    return `${text1} - ${text2}`;
  }, [seletedDate]);

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
          items={vuePrices}
          value={selectedPrices}
          onChange={(id) => setSelecterdPrices(id)}
          title="Выберете стоимость"
          placeholder="Выберете стоимость"
        />
        <Popup
          isOpen={isOpenCalendar}
          trigger="click"
          placement="bottom"
          disclosure={<TextField readOnly value={dataText} />}
          onToggle={(newState) => setIsOpenCalendar(newState)}
        >
          <StyledCalendar
            isRange
            value={seletedDate}
            onChangeValue={(dates) => setSeletedDate(dates)}
          />
        </Popup>
        <Select
          items={vueRegions}
          value={selectedRegion}
          onChange={(id) => setSelectedRegion(id)}
          title="Выберете регион"
          placeholder="Выберете регион"
        />
        <Button view="primary" onClick={handleSerch}>Найти</Button>
        <Button view="clear" onClick={handleClear}>очтистить поиск</Button>
      </FormSelectWrapper>
    </Wrapper>
  );
}
