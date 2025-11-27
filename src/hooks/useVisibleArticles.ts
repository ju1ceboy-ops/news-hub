import { useState, useMemo } from 'react';
import { Article } from '../services/useFetchArticles';
import { ArticleWithMultimedia } from '../types/article';
import { groupArticlesByDay } from '../services/useFetchArticles';
import { UI_CONFIG } from '../constants';

/**
 * Хук для управления видимыми статьями с группировкой по дням
 */
export const useVisibleArticles = (articles: Article[] | undefined, visibleCount: number) => {
  return useMemo(() => {
    if (!articles || articles.length === 0) {
      return {};
    }

    // Группируем статьи по дням
    const articlesByDay = groupArticlesByDay(articles);
    
    // Сортируем дни от новых к старым
    const sortedDates = Object.keys(articlesByDay).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    // Сортируем статьи внутри каждого дня от новых к старым
    const sortedArticlesByDay: Record<string, ArticleWithMultimedia[]> = {};
    sortedDates.forEach(date => {
      sortedArticlesByDay[date] = [...articlesByDay[date]].sort((a, b) => 
        new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime()
      );
    });

    // Ограничиваем количество отображаемых статей
    let remainingCount = visibleCount;
    const limitedArticlesByDay: Record<string, ArticleWithMultimedia[]> = {};

    for (const date of sortedDates) {
      if (remainingCount <= 0) break;
      
      const articlesForDay = sortedArticlesByDay[date];
      const takeCount = Math.min(articlesForDay.length, remainingCount);
      limitedArticlesByDay[date] = articlesForDay.slice(0, takeCount);
      remainingCount -= takeCount;
    }

    return limitedArticlesByDay;
  }, [articles, visibleCount]);
};

/**
 * Хук для управления счетчиком видимых статей
 */
export const useArticleCounter = (totalArticles: number) => {
  const [visibleCount, setVisibleCount] = useState(UI_CONFIG.INITIAL_ARTICLES_COUNT);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + UI_CONFIG.ARTICLES_INCREMENT, totalArticles));
  };

  const hasMore = visibleCount < totalArticles;

  return { visibleCount, loadMore, hasMore };
};

