import { Controller } from './controller';
import { AnyObject } from './utils';

export type EmptyCallbback = () => void;
export type DestroyAction = (callback: EmptyCallbback) => void;

export type Unsunscribe = () => void;
export type Observable<T> = {
  subscribe: (callback: (value: T) => void) => Unsunscribe;
};

export type Scope = {
  add: DestroyAction;

  /**
   * Create child scope
   */
  createScope: () => Scope;
  /**
   * Creates a controller which will be destroyed with the scope.
   */
  createController: <ControllerProps extends AnyObject = AnyObject>(
    factory: () => Controller<ControllerProps>,
  ) => Controller<ControllerProps>;

  subscribe: <T>(
    source: Observable<T>,
    subscribeCallback: (newValue: T) => void,
  ) => Unsunscribe;

  destroy: () => void;
}

export function createScope(): Scope {
  const destroySubscribes = new Set<EmptyCallbback>();

  function add(callback: EmptyCallbback) {
    destroySubscribes.add(callback);
  }

  function destroy() {
    destroySubscribes.forEach((callback) => callback());
    destroySubscribes.clear();
  }

  function createController<ControllerProps extends AnyObject = AnyObject>(
    factory: () => Controller<ControllerProps>,
  ) {
    const controller = factory();
    add(controller.destroy);

    return controller;
  }

  function createScope(): Scope {
    const childScope = createScope();

    add(childScope.destroy);

    return childScope;
  }

  function subscribe<T>(
    source: Observable<T>,
    subscribeCallback: (newValue: T) => void
  ): Unsunscribe {
    const subscription = source.subscribe(subscribeCallback);
    add(subscription);

    return subscription;
  }

  return {
    add,
    createController,
    createScope,

    subscribe,

    destroy,
  };
}
