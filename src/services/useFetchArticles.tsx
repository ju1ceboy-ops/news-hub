import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_CONFIG, QUERY_CONFIG } from "../constants";

const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;

export interface Article {
  headline: {
    main: string;
  };
  abstract: string;
  pub_date: string; // Формат: "2023-01-01T00:00:00Z"
  section_name: string;
  web_url: string;
}

interface ApiResponse {
  response: {
    docs: Article[];
  };
}

/**
 * Группирует статьи по дням публикации
 * @param articles - массив статей
 * @returns объект с ключами-датами и массивами статей
 */
export const groupArticlesByDay = (articles: Article[]): Record<string, Article[]> => {
  const grouped: Record<string, Article[]> = {};
  
  articles.forEach(article => {
    // Извлекаем только дату без времени (формат YYYY-MM-DD)
    const date = article.pub_date.split('T')[0];
    
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(article);
  });
  
  return grouped;
};

/**
 * Загружает статьи из NYT API
 * @param year - год
 * @param month - месяц
 * @returns массив статей
 */
const fetchArticles = async (year: number, month: number): Promise<Article[]> => {
  const apiUrl = `${API_CONFIG.BASE_URL}/${year}/${month}.json?api-key=${NYT_API_KEY}`;
  const proxyUrl = `${API_CONFIG.PROXY_URL}${encodeURIComponent(apiUrl)}`;

  const response = await axios.get<ApiResponse>(proxyUrl, {
    headers: {
      Accept: "application/json",
    }
  });

  return response.data.response.docs;
};

/**
 * Хук для загрузки статей с использованием React Query
 * @param year - год
 * @param month - месяц
 * @returns результат запроса React Query
 */
export const useFetchArticles = (year: number, month: number) => {
  return useQuery({
    queryKey: ["articles", year, month],
    queryFn: () => fetchArticles(year, month),
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT,
  });
};