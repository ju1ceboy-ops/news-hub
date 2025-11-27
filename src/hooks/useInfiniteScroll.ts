import { useEffect, useRef, useCallback, useState } from 'react';
import { UI_CONFIG } from '../constants';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

/**
 * Хук для реализации бесконечного скролла
 */
export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = UI_CONFIG.SCROLL_THRESHOLD,
}: UseInfiniteScrollOptions) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore || isLoading) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      onLoadMore();
      setIsLoadingMore(false);
    }, UI_CONFIG.LOAD_MORE_DELAY);
  }, [isLoadingMore, hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMore, threshold]);

  return { loaderRef, isLoadingMore };
};

