import Cookies from 'js-cookie';

const COOKIE_NAME = 'solar_config';
const COOKIE_EXPIRY = 7; // days

export type ConfigData = {
  metrics: any;
  address: string;
};

export const loadConfigFromCookie = (): ConfigData | null => {
  const savedConfig = Cookies.get(COOKIE_NAME);
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.error('Error parsing saved configuration:', e);
      Cookies.remove(COOKIE_NAME);
    }
  }
  return null;
};

export const saveConfigToCookie = (config: ConfigData) => {
  Cookies.set(COOKIE_NAME, JSON.stringify(config), { expires: COOKIE_EXPIRY });
};