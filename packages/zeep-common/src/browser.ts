import Bowser from 'bowser';

export type BrowserInfo = {
  name?: string;
  version?: string;
};

export function getBrowserName(userAgent: string): BrowserInfo {
  const alohaBrowser = userAgent.match(/(AlohaBrowser)\/([\d.]+)/i);

  if (alohaBrowser) {
    return {
      name: 'AlohaBrowser',
      version: alohaBrowser[2],
    };
  }

  const browser = Bowser.parse(userAgent).browser;

  if (!browser.name && /Chrome|CriOS/.test(userAgent)) {
    return {
      name: 'Chrome',
    };
  }

  return browser;
}
