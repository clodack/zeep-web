export function createSearchParams(
  query: Record<
    string,
    string | boolean | number | (string | boolean | number)[]
  >,
  originUrlSearch?: string,
): string {
  const searchParams = new URLSearchParams(originUrlSearch || '');

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}