import { FC } from 'react';

import { Button } from '@salutejs/plasma-b2c';
import { IconApps, IconCameraVideo, IconLocationFill } from '@salutejs/plasma-icons';

export const MobileActions: FC = () => {
  return (
    <>
      <Button
        pin="circle-circle"
        contentLeft={<IconApps />}
        title='Сервисы'
        aria-label="Сервисы"
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
