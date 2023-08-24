import {
  bindMultiValue,
  Container,
  declareModule,
  Module,
  ModuleDeclaration,
  Token,
  token,
} from 'ditox';

import { AnyObject, PartialProp } from './utilityTypes';

export type RuntimeLifecycleCallback<T> = (
  value: T,
  container: Container,
) => void | Promise<void>;

export type RuntimeLifecycle<T> = Readonly<{
  token: Token<T>;
  priority?: number;
  onPostBinding?: RuntimeLifecycleCallback<T>;
  onPlatformPreInit?: RuntimeLifecycleCallback<T>;
  onPlatformInit?: RuntimeLifecycleCallback<T>;
  onPlatformPostInit?: RuntimeLifecycleCallback<T>;
  onPreInit?: RuntimeLifecycleCallback<T>;
  onInit?: RuntimeLifecycleCallback<T>;
  onPostInit?: RuntimeLifecycleCallback<T>;
}>;

export type RuntimeLifecycleCallbackKeys = keyof Pick<
  RuntimeLifecycle<unknown>,
  | 'onPostBinding'
  | 'onPlatformPreInit'
  | 'onPlatformInit'
  | 'onPlatformPostInit'
  | 'onPreInit'
  | 'onInit'
  | 'onPostInit'
>;

export const RUNTIME_LIFECYCLE_ORDER: ReadonlyArray<RuntimeLifecycleCallbackKeys> =
  [
    'onPostBinding',
    'onPlatformPreInit',
    'onPlatformInit',
    'onPlatformPostInit',
    'onPreInit',
    'onInit',
    'onPostInit',
  ];

export type RuntimeLifecycleConfig<T> = Omit<RuntimeLifecycle<T>, 'token'>;

export const RUNTIME_LIFECYCLE_TOKEN =
  token<ReadonlyArray<RuntimeLifecycle<unknown>>>();

export function bindRuntimeLifecycle<T>(
  container: Container,
  lifecycle: RuntimeLifecycle<T>,
): void {
  bindMultiValue(
    container,
    RUNTIME_LIFECYCLE_TOKEN,
    lifecycle as RuntimeLifecycle<unknown>,
  );
}

export type RuntimeModuleConfig<T extends Module<AnyObject>> = PartialProp<
  ModuleDeclaration<T>,
  'token'
> & {
  lifecycle?: RuntimeLifecycleConfig<T>;
};

export function declareRuntimeModule<T extends Module<AnyObject>>(
  config: RuntimeModuleConfig<T>,
): ModuleDeclaration<T> {
  const module = declareModule<T>(config);

  return {
    ...module,

    afterBinding: (container) => {
      bindRuntimeLifecycle<T>(container, {
        ...config.lifecycle,
        token: module.token,
      });

      module.afterBinding?.(container);
    },
  };
}
