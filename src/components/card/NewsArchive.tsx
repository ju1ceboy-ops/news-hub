import { motion } from 'framer-motion';
import { useFetchArticles } from "../../services/useFetchArticles";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";
import { useVisibleArticles, useArticleCounter } from "../../hooks/useVisibleArticles";
import { getBestImage, formatImageUrl, formatDate, formatTime } from "../../utils/articleUtils";
import { DEFAULT_DATE } from "../../constants";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorDisplay } from "../common/ErrorDisplay";
import styles from "./News.module.scss";

function NewsArchive() {
  const { data: articles, isLoading, isError, error, refetch } = useFetchArticles(
    DEFAULT_DATE.YEAR,
    DEFAULT_DATE.MONTH
  );

  const { visibleCount, loadMore, hasMore } = useArticleCounter(articles?.length || 0);
  const limitedArticlesByDay = useVisibleArticles(articles, visibleCount);
  const { loaderRef, isLoadingMore } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMore,
  });
  const { lastUpdate } = useAutoRefresh({ onRefresh: refetch });

  if (isLoading) return <LoadingSpinner />;

  if (isError && error) {
    return <ErrorDisplay error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className={styles.news__container}>
      {lastUpdate && (
        <div className={styles.lastUpdate}>
          Last update: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      {Object.entries(limitedArticlesByDay).map(([date, dayArticles]) => (
        <section key={date} className={styles.daySection}>
          <motion.h2 
            className={styles.dayHeader}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {formatDate(date)}
          </motion.h2>
          
          <div className={styles.articlesGrid}>
            {dayArticles.map((article, index) => {
              const image = getBestImage(article.multimedia);
              
              return (
                <motion.article 
                  key={`${date}-${index}`}
                  className={styles.articleCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  onClick={() => window.open(`${article.web_url}`, '_blank')}
                >
                  {image && (
                    <div className={styles.imageContainer}>
                      <img 
                        src={formatImageUrl(image.url)} 
                        alt={image.caption || article.headline.main}
                        className={styles.articleImage}
                        loading="lazy"
                      />
                      {image.copyright && (
                        <span className={styles.imageCopyright}>© {image.copyright}</span>
                      )}
                    </div>
                  )}
                  
                  <div className={styles.articleContent}>
                    <h3>{article.headline.main}</h3>
                    <p>{article.abstract}</p>
                    <div className={styles.articleMeta}>
                      <span className={styles.section}>{article.section_name}</span>
                      <time className={styles.time}>
                        {formatTime(article.pub_date)}
                      </time>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      ))}

      {/* Прелоадер для бесконечного скролла */}
      <div ref={loaderRef} className={styles.observerTarget}>
        {isLoadingMore && <LoadingSpinner />}
      </div>

      {/* Сообщение о конце списка */}
      {articles && visibleCount >= articles.length && (
        <motion.div 
          className={styles.endMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Вы просмотрели все новости за этот период
        </motion.div>
      )}
    </div>
  );
}

export default NewsArchive;