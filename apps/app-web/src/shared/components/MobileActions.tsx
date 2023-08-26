import { FC, useCallback } from 'react';

import { Button } from '@salutejs/plasma-b2c';
import { IconApps, IconCameraVideo, IconLocationFill } from '@salutejs/plasma-icons';
import { useGlobalContext } from '../contexts/globalContext';

export const MobileActions: FC = () => {
  const { eventBus } = useGlobalContext();

  const toggleServices = useCallback(() => {
    eventBus({ type: 'togleAppsModal', payload: { isOpen: true } });
    eventBus({ type: 'toggleCamera', payload: { isOpen: false } });
  }, [eventBus]);

  const toggleLocation = useCallback(() => {
    eventBus({ type: 'togleAppsModal', payload: { isOpen: false } });
    eventBus({ type: 'toggleCamera', payload: { isOpen: false } });
  }, [eventBus]);

  const toggleCamera = useCallback(() => {
    eventBus({ type: 'togleAppsModal', payload: { isOpen: false } });
    eventBus({ type: 'toggleCamera', payload: { isOpen: true } });
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
