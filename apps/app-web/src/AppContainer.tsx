import { FC, useEffect } from 'react';
import { ModalsProvider } from '@salutejs/plasma-b2c';

import { createWebZeepSDK } from 'zeep-sdk-web/src';

import { GlobalContextProvider, useGlobalContext } from './shared/contexts/globalContext';
import { GlobalStyles } from './shared/components/GlobalStyled';

import { App } from './App';

const AppRootSDK: FC = () => {
  const { sdk, setSDK } = useGlobalContext();

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

  

  return (
    <>
      {sdk && (
        <App />
      )}
    </>
  )
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
