import { FC, useEffect, useRef, useState } from 'react';
import {
  YMaps,
  useYMaps,
} from '@pbe/react-yandex-maps';
import styled from 'styled-components/macro';
import { filter } from 'rxjs';

import { getPlatformModule, getCoreMapModule, getMapChannel } from 'zeep-sdk-core/src';

import { useGlobalContext } from '../../contexts/globalContext';

import { MOCK_ITEMS } from './mock';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  > div {
    width: 100%;
    height: 100%;
  }
`;

const DEFAULT_ZOOM = 10;

const InnterComponent: FC = () => {
  const { sdk } = useGlobalContext();
  const ref = useRef<HTMLDivElement>(null);

  const mapRef = useRef(null);
  const ymaps = useYMaps(['Map', 'ObjectManager', 'Placemark']);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [defaultState, setDefaultState] = useState<undefined | [number, number]>(undefined);
  const [map, setMap] = useState<ymaps.Map | undefined>(undefined);

  useEffect(() => {
    if (!sdk) return;

    const platform = getPlatformModule(sdk);
    const coreMap = getCoreMapModule(sdk);
    const mapChannel = getMapChannel(sdk);

    if (map) {
      // @TODO
      // mapChannel.startChannel();

      const { latitude, longitude } = coreMap.coords.get();

      mapChannel.channel?.next({
        type: 'changeLocation',
        payload: { latitude, longitude, zoom: DEFAULT_ZOOM }
      });

      map.events.add('actionend', () => {
        const center = map.getCenter();
        const zoom = map.getZoom();

        mapChannel.channel?.next({
          type: 'changeLocation',
          payload: { latitude: center[0], longitude: center[1], zoom }
        });
      });
    }

    const subscribeDefaultLocation = coreMap.permitionsState.value$
      .pipe(filter((state) => state === 'granted'))
      .subscribe(() => {
        const { latitude, longitude } = coreMap.coords.get();
        setDefaultState(oldState => {
          if (oldState) return oldState;

          return [latitude, longitude];
        });
      });

    const subscription = platform.windowDimensions.value$.subscribe(() => {
      if (!ref.current) return;

      setWidth(ref.current.offsetWidth);
      setHeight(ref.current.offsetHeight);
    });

    return () => {
      subscribeDefaultLocation.unsubscribe();
      subscription.unsubscribe();
      mapChannel.stopChannel();
    }
  }, [sdk, ref, map]);

  useEffect(() => {
    if (!ymaps || !mapRef.current || !defaultState) {
      return;
    }

    const map = new ymaps.Map(mapRef.current, {
      center: defaultState,
      zoom: DEFAULT_ZOOM,
    });
    setMap(map);

    const objectManager = new ymaps.ObjectManager({
      clusterize: true,
      gridSize: 32,
      clusterDisableClickZoom: true
    });

    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    map.geoObjects.add(objectManager);

    objectManager.add(MOCK_ITEMS);
  }, [ymaps, defaultState]);

  return (
    <Wrapper ref={ref}>
      <div ref={mapRef} style={{ width, height }} />
    </Wrapper>
  );
}

export const MapWrapper: FC = () => {

  return (
      <YMaps
        query={{
          lang: 'en_RU',
          apikey: process.env.ZEEP_APP_YANDEX_MAP_KEY || undefined,
        }}
      >
        <InnterComponent />
      </YMaps>
  );
}
