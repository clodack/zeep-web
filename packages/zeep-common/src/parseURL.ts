export function parseURL(url: string): URL | undefined {
  try {
    return new URL(url);
  } catch (err) {
    console.error('Error parse url', err);
    return undefined;
  }
}