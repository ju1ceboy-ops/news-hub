// API конфигурация
export const API_CONFIG = {
  BASE_URL: 'https://api.nytimes.com/svc/archive/v1',
  PROXY_URL: 'https://corsproxy.io/?',
  NYT_IMAGE_BASE_URL: 'https://www.nytimes.com',
} as const;

// Настройки запросов
export const QUERY_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 минут
  RETRY_COUNT: 2,
} as const;

// Настройки UI
export const UI_CONFIG = {
  INITIAL_ARTICLES_COUNT: 5,
  ARTICLES_INCREMENT: 5,
  AUTO_REFRESH_INTERVAL: 10000, // 10 секунд
  LOAD_MORE_DELAY: 1000, // 1 секунда
  SCROLL_THRESHOLD: 0.1,
  HEADER_SCROLL_THRESHOLD: 70,
} as const;

// Настройки изображений
export const IMAGE_CONFIG = {
  MIN_WIDTH: 600,
  TYPE: 'image',
  SUBTYPE: 'photo',
} as const;

// Дефолтные значения для дат
export const DEFAULT_DATE = {
  YEAR: 2025,
  MONTH: 5,
} as const;

