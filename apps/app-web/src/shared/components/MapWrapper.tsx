import { FC, useEffect, useRef, useState } from 'react';
import { YMaps, Map } from '@pbe/react-yandex-maps';
import styled from 'styled-components/macro';

import { useGlobalContext } from '../contexts/globalContext';
import { getPlatformModule, getCoreMapModule } from 'zeep-sdk-core/src';
import { filter } from 'rxjs';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;

  > * {
    width: 100%;
    height: 100vh;
  }
`;

export const MapWrapper: FC = () => {
  const { sdk } = useGlobalContext();
  const ref = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [defaultState, setDefaultState] = useState([0, 0]);

  useEffect(() => {
    if (!sdk) return;

    const platform = getPlatformModule(sdk);
    const coreMap = getCoreMapModule(sdk);
    
    console.log('___coreMap', coreMap);

    const subscribeDefaultLocation = coreMap.permitionsState.value$
      .pipe(filter((state) => state === 'granted'))
      .subscribe(() => {
        const { latitude, longitude } = coreMap.coords.get();
        setDefaultState([latitude, longitude]);
      });

    const subscription = platform.windowDimensions.value$.subscribe(() => {
      if (!ref.current) return;

      setWidth(ref.current.offsetWidth);
      setHeight(ref.current.offsetHeight);
    });

    return () => {
      subscribeDefaultLocation.unsubscribe();
      subscription.unsubscribe();
    }
  }, [sdk, ref]);

  return (
    <Wrapper ref={ref}>
      <YMaps>
        <Map
          defaultState={{ center: defaultState, zoom: 9 }}
          width={width}
          height={height}
        />
      </YMaps>
    </Wrapper>
  );
}