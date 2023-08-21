/**
 * @ignore
 * Binding token for mandatory value
 */
export type RequiredToken<T> = {
  symbol: symbol;
  type?: T; // Anchor for Typescript type inference.
  isOptional?: false;
};

/**
 * @ignore
 * Binding token for optional value
 */
export type OptionalToken<T> = {
  symbol: symbol;
  type?: T; // Anchor for Typescript type inference.
  isOptional: true;
  optionalValue: T;
};

/**
 * Binding token.
 */
export type Token<T> = RequiredToken<T> | OptionalToken<T>;

/**
 * Creates a new binding token.
 * @param description - Token description for better error messages.
 */
export function token<T>(description?: string): Token<T> {
  return { symbol: Symbol(description) };
}

/**
 * Decorate a token with an optional value.
 * This value is be used as default value in case a container does not have registered token.
 * @param token - Existed token.
 * @param optionalValue - Default value for the resolver.
 */
export function optionalToken<T>(
  token: Token<T>,
  optionalValue: T,
): OptionalToken<T>;
export function optionalToken<T>(token: Token<T>): OptionalToken<T | undefined>;
export function optionalToken<T>(
  token: Token<T>,
  optionalValue?: T,
): OptionalToken<T | undefined> {
  return {
    symbol: token.symbol,
    isOptional: true,
    optionalValue,
  };
}
