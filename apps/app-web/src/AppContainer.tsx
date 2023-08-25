import { FC, useEffect } from 'react';
import { ModalsProvider } from '@salutejs/plasma-b2c';

import { createWebZeepSDK } from 'zeep-sdk-web/src';

import { GlobalContextProvider, useGlobalContext } from './shared/contexts/globalContext';
import { GlobalStyles } from './shared/components/GlobalStyled';

import { useLayout } from './shared/hoos/useLayout';
import { MobileApp } from './app/MobileApp';
import { TabletApp } from './app/TabletApp';
import { DesktopApp } from './app/DesktopApp';

const AppRootSDK: FC = () => {
  const { setSDK } = useGlobalContext();

  useEffect(() => {
    console.log('Start creating sdk....');

    createWebZeepSDK()
      .then((sdk) => {
        console.log('SDK is created!');
        setSDK(sdk);
      })
      .catch((error) => {
        console.error('Fail create SDK', error);
      });
  }, [setSDK]);

  return <AppRoot />;
}

export const AppRoot: FC = () => {
  const layout = useLayout();

  if (!layout) return null;

  if (layout === 'mobile') {
    return <MobileApp />;
  }

  if (layout === 'tablet') {
    return <TabletApp />;
  }

  return <DesktopApp />;
}

export const AppContainer: FC = () => {
  return (
    <GlobalContextProvider>
      <ModalsProvider>
        <GlobalStyles />
        <AppRootSDK />
      </ModalsProvider>
    </GlobalContextProvider>
  );
}
