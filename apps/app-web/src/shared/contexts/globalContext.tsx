import {
  createContext,
  ReactNode,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ZeepSDK } from 'zeep-sdk-web/src';
import { createEventBus, EventBus } from 'zeep-common/src/events';
import { handleEvent } from 'zeep-common/src/query';
import { Observable } from 'rxjs';

export type Events = Readonly<
  | {
      type: 'setSDK';
      payload: { sdk: ZeepSDK };
    }
  | {
      type: 'error';
      payload: { title: string };
    }
  | {
      type: 'togleAppsModal',
      payload: {
        isOpen: boolean;
      }
    }
  | {
      type: 'toggleCamera',
      payload: {
        isOpen: boolean;
      }
    }
  | {
      type: 'toggleReelse',
      payload: {
        isOpen: boolean;
      }
    }
>;

export type GlobalContext = {
  sdk: ZeepSDK | undefined;
  setSDK: (sdk: ZeepSDK) => void;

  eventBus: EventBus<Events>;
  event$: Observable<Events>;
}

function getInitialState(): GlobalContext {
  const eventBus = createEventBus<Events>();

  return {
    sdk: undefined,
    setSDK(sdk) {
      eventBus({
        type: 'setSDK',
        payload: { sdk }
      })
    },

    eventBus,
    event$: eventBus.event$,
  }
}

const globalContext = createContext<GlobalContext | undefined>(undefined);

export function useGlobalContext(): GlobalContext {
  const context = useContext(globalContext);

  if (!context) {
    throw new Error('GlobalContext is not init');
  }

  return context;
}

export const GlobalContextProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlobalContext>(getInitialState);

  useEffect(() => {
    handleEvent(state.event$, 'setSDK', ({ payload: { sdk } }) => {
      setState((prevState) => ({ ...prevState, sdk }));
    });
  }, [state]);

  return (
    <globalContext.Provider value={state}>{ children }</globalContext.Provider>
  );
}