import { FC } from 'react';

import { Button } from '@salutejs/plasma-b2c';
import { IconApps, IconCameraVideo, IconLocationFill } from '@salutejs/plasma-icons';
import { useGlobalContext } from '../contexts/globalContext';

export const MobileActions: FC = () => {
  const { eventBus } = useGlobalContext();

  return (
    <>
      <Button
        pin="circle-circle"
        contentLeft={<IconApps />}
        title='Сервисы'
        aria-label="Сервисы"
        onClick={() => eventBus({ type: 'togleAppsModal' })}
      />
      <Button
        pin="circle-circle"
        contentLeft={<IconLocationFill />}
      />
      <Button
        pin="circle-circle"
        contentLeft={<IconCameraVideo />}
      />
    </>
  );
}
