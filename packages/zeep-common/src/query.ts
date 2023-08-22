import { Query as RXEffectsQuery } from 'rx-effects';
import { Observable, skip } from 'rxjs';

import { EventLike, filterEventsByType } from './events';

export type Query<T> = RXEffectsQuery<T>;
export type Unsubscriber = () => void;

export function handleQuery<T>(
  query: Query<T>,
  listener: (value: T) => unknown,
): Unsubscriber {
  const subscribtion = query.value$.subscribe(listener);

  return () => {
    subscribtion.unsubscribe();
  };
}

export function handleQueryChanges<T>(
  query: Query<T>,
  listener: (value: T) => unknown,
): Unsubscriber {
  const subscribtion = query.value$.pipe(skip(1)).subscribe(listener);

  return () => {
    subscribtion.unsubscribe();
  };
}

export function handleEvent<
  Event extends EventLike,
  Type extends Event['type'],
  TypedEvent extends Event & { type: Type },
>(
  eventBus: Observable<Event>,
  type: Type,
  listener: (event: TypedEvent) => unknown,
  isOnse = false,
): Unsubscriber {
  const subscription = eventBus
    .pipe(filterEventsByType<Event, Type, TypedEvent>(type))
    .subscribe((...args) => {
      listener(...args);

      if (isOnse) {
        subscription.unsubscribe();
      }
    });

  return () => {
    subscription.unsubscribe();
  };
}

export function handleEvents<Event extends EventLike>(
  eventBus: Observable<Event>,
  listener: (event: Event) => unknown,
  isOnse = false,
): Unsubscriber {
  const subscription = eventBus
    .subscribe((...args) => {
      listener(...args);

      if (isOnse) {
        subscription.unsubscribe();
      }
    });

  return () => {
    subscription.unsubscribe();
  };
}
