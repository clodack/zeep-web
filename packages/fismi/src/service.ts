import { Container } from './container';
import { Controller } from './controller';
import { Scope } from './scope';
import { token, Token } from './token';
import { AnyObject, EmptyObject } from './utils';

export type Service<ServiceProps extends AnyObject = EmptyObject> =
  Controller & ServiceProps;

/**
 * Options for module binding.
 *
 * `scope` types:
 *   - `singleton` - **This is the default**. The module is created and cached by the container which registered the factory.
 *   - `scoped` - The module is created and cached by the container which starts resolving.
 */
export type BindServiceOptions = {
  scope?: 'scoped' | 'singleton';
};

export type ServiceBindingEntry =
  | ServiceDeclaration<Service<AnyObject>>
  | {
      service: ServiceDeclaration<Service<AnyObject>>;
      options: BindServiceOptions;
    };

export type ServiceDeclaration<
  T extends Service<AnyObject>,
  Imports extends ReadonlyArray<unknown> = [],
> = {
  token: Token<T>;
  imports: Imports,
  factory: (container: Container, scope: Scope, imports: Imports) => T;

  beforeBinding?: (container: Container) => void;
  afterBinding?: () => void;
  afterDestroy?: () => void;
};

export function declareModule<T extends Service<AnyObject>>(
  declaration: Omit<ServiceDeclaration<T>, 'token'> &
    Partial<Pick<ServiceDeclaration<T>, 'token'>>,
) {
  return {
    ...declaration,
    token: declaration.token ?? token(),
  }
}

export function bindService<T extends Service<AnyObject>>(
  container: Container,
  serviceDeclaration: ServiceDeclaration<T>,
  options?: BindServiceOptions,
) {
  const {
    imports,
    token,
    beforeBinding,
    factory,
  } = serviceDeclaration;

  beforeBinding?.(container);
  bindServices(container, imports);

  const scope = options?.scope;

  // xcontainer.bindFactory(token, factory)
}

export function bindServices(
  container: Container,
  services: ReadonlyArray<ServiceBindingEntry>
) {
  services.forEach((entry) => {
    if ('service' in entry) {
      bindService(container, entry.service, entry.options);
    } else {
      bindService(container, entry);
    }
  });
}

