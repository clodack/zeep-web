import { Scope } from './scope';
import { Token } from './token';

// /** @internal */
// type FactoryContext<T> = {
//   factory: (container: Container) => T;
//   options?: FactoryOptions<T>;
// };

/** @internal */
type ValuesMap = Map<symbol, any>;

/** @internal */
// export type FactoriesMap = Map<symbol, FactoryContext<any>>;

export type Container = {
  /**
   * Binds a value for the token
   */
  bindValue<T>(token: Token<T>, value: T): void;

  /**
   * Binds a factory for the token.
   */
  // bindFactory<T>(
  //   token: Token<T>,
  //   factory: (scope: Scope) => T,
  //   options?: FactoryOptions<T>,
  // ): void;

  /**
   * Checks if the token is registered in the container hierarchy.
   */
  hasToken(token: Token<unknown>): boolean;

  /**
   * Returns a resolved value by the token, or returns `undefined` in case the token is not found.
   */
  get<T>(token: Token<T>): T | undefined;

  /**
   * Returns a resolved value by the token, or throws `ResolverError` in case the token is not found.
   */
  resolve<T>(token: Token<T>): T;

  /**
   * Removes a binding for the token.
   */
  remove<T>(token: Token<T>): void;

  /**
   * Removes all bindings in the container.
   */
  removeAll(): void;
};


// export function createContainer(parentContainer?: Container): Container {
//   const values: ValuesMap = new Map<symbol, any>();
//   const factories: FactoriesMap = new Map<symbol, FactoryContext<any>>();

//   const container: Container = {};

//   return container;
// }
