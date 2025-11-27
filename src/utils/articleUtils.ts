import { Multimedia } from '../types/article';
import { IMAGE_CONFIG, API_CONFIG } from '../constants';

/**
 * Находит лучшее изображение из массива multimedia
 * @param multimedia - массив мультимедиа элементов
 * @returns лучшее изображение или null
 */
export const getBestImage = (multimedia: Multimedia[] | undefined): Multimedia | null => {
  if (!multimedia || multimedia.length === 0) return null;
  
  const image = multimedia.find(media => 
    media.type === IMAGE_CONFIG.TYPE && 
    media.subtype === IMAGE_CONFIG.SUBTYPE &&
    media.width >= IMAGE_CONFIG.MIN_WIDTH
  );
  
  return image || multimedia[0];
};

/**
 * Форматирует URL изображения для отображения
 * @param imageUrl - относительный URL изображения
 * @returns полный URL изображения
 */
export const formatImageUrl = (imageUrl: string): string => {
  return `${API_CONFIG.NYT_IMAGE_BASE_URL}/${imageUrl}`;
};

/**
 * Форматирует дату для отображения
 * @param dateString - строка даты в формате ISO
 * @param locale - локаль для форматирования
 * @returns отформатированная дата
 */
export const formatDate = (dateString: string, locale: string = 'en-EN'): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Форматирует время для отображения
 * @param dateString - строка даты в формате ISO
 * @param locale - локаль для форматирования
 * @returns отформатированное время
 */
export const formatTime = (dateString: string, locale: string = 'ru-RU'): string => {
  return new Date(dateString).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

