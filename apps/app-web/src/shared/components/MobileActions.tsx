import { FC, useCallback, useEffect, useState } from 'react';

import { Button } from '@salutejs/plasma-b2c';
import {
  IconApps,
  IconCameraVideo,
  IconLocationFill,
  IconPicture,
} from '@salutejs/plasma-icons';
import { useGlobalContext } from '../contexts/globalContext';
import { getIsMobile } from 'zeep-sdk-core/src';

export const MobileActions: FC = () => {
  const { eventBus, sdk } = useGlobalContext();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!sdk) return;

    const isMobile = getIsMobile(sdk);

    setIsMobile(isMobile.get());
    isMobile.value$.subscribe((value) => {
      setIsMobile(value);
    });
  }, [sdk]);

  const toggleServices = useCallback(() => {
    eventBus({ type: 'togleAppsModal', payload: { isOpen: true } });
    eventBus({ type: 'toggleCamera', payload: { isOpen: false } });
    eventBus({ type: 'toggleReelse', payload: { isOpen: false } });
  }, [eventBus]);

  const toggleReelse = useCallback(() => {
    eventBus({ type: 'togleAppsModal', payload: { isOpen: false } });
    eventBus({ type: 'toggleCamera', payload: { isOpen: false } });
    eventBus({ type: 'toggleReelse', payload: { isOpen: true } });
  }, [eventBus]);

  const toggleLocation = useCallback(() => {
    eventBus({ type: 'togleAppsModal', payload: { isOpen: false } });
    eventBus({ type: 'toggleCamera', payload: { isOpen: false } });
    eventBus({ type: 'toggleReelse', payload: { isOpen: false } });
  }, [eventBus]);

  const toggleCamera = useCallback(() => {
    eventBus({ type: 'togleAppsModal', payload: { isOpen: false } });
    eventBus({ type: 'toggleCamera', payload: { isOpen: true } });
    eventBus({ type: 'toggleReelse', payload: { isOpen: false } });
  }, [eventBus]);

  return (
    <>
      <Button
        pin="circle-circle"
        contentLeft={<IconApps />}
        title='Сервисы'
        aria-label="Сервисы"
        onClick={toggleServices}
      />
      {isMobile && (
        <Button
          pin="circle-circle"
          contentLeft={<IconPicture />}
          title='Истории'
          aria-label="Истории"
          onClick={toggleReelse}
        />
      )}
      <Button
        pin="circle-circle"
        contentLeft={<IconLocationFill />}
        onClick={toggleLocation}
      />
      <Button
        pin="circle-circle"
        contentLeft={<IconCameraVideo />}
        onClick={toggleCamera}
      />
    </>
  );
}
