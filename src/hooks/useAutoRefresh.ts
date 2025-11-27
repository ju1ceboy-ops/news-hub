import { useEffect, useState } from 'react';
import { UI_CONFIG } from '../constants';

interface UseAutoRefreshOptions {
  onRefresh: () => Promise<unknown>;
  interval?: number;
}

/**
 * Хук для автоматического обновления данных
 */
export const useAutoRefresh = ({
  onRefresh,
  interval = UI_CONFIG.AUTO_REFRESH_INTERVAL,
}: UseAutoRefreshOptions) => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const refreshData = async () => {
      await onRefresh();
      setLastUpdate(new Date());
    };

    const intervalId = setInterval(refreshData, interval);

    return () => clearInterval(intervalId);
  }, [onRefresh, interval]);

  return { lastUpdate };
};

