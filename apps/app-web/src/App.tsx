import { FC, useState, useEffect } from 'react';
import { ModalsProvider } from '@salutejs/plasma-b2c';

import { createZeepSDK, getPlatformModule } from 'zeep-sdk/src';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GlobalContextProvider, useGlobalContext } from './shared/contexts/globalContext';
import { GlobalStyles } from './shared/components/GlobalStyled';

type InitSDKStatus = 'fail' | 'process' | 'success';

const App: FC = () => {
  const { setSDK, eventBus } = useGlobalContext();
  const [count, setCount] = useState(0);
  const [processCreateSDK, setProcessCreateSDK] = useState(false);
  const [status, setStatus] = useState<InitSDKStatus>('process');

  useEffect(() => {
    if (processCreateSDK) return;

    setProcessCreateSDK(true);
    console.log('Start creating sdk....');

    let destroy: (() => void) | undefined;

    createZeepSDK()
      .then((sdk) => {
        console.log('SDK is created!');
        setSDK(sdk);
        setStatus('success');
        destroy = sdk.destroy;
      })
      .catch((error) => {
        console.error('Fail create SDK', error);
        setStatus('fail');
        eventBus({ type: 'error', payload: { title: 'fail create sdk' } });
      });

    return () => {
      destroy?.();
    }
  }, [processCreateSDK, setSDK, eventBus]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <TestChild />
    </>
  )
}

const TestChild: FC = () => {
  const { sdk } = useGlobalContext();

  useEffect(() => {
    if (!sdk) return;

    const platform = getPlatformModule(sdk);
    console.log('____platform', platform);
  }, [sdk]);
  return null;
}

export const AppContainer: FC = () => {
  return (
    <GlobalContextProvider>
      <ModalsProvider>
        <GlobalStyles />
        <App />
      </ModalsProvider>
    </GlobalContextProvider>
  );
}
