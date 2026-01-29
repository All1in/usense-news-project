import { memo, useMemo } from 'react';
import { NewsCard } from './NewsCard';
import { EmptyState } from './EmptyState';
import type { NewsArticle } from '../types/news';

interface NewsListProps {
  articles: NewsArticle[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  emptyStateType?: 'search' | 'category' | 'general';
  searchQuery?: string;
  category?: string;
  onReset?: () => void;
  onLoadMoreRef?: (node: HTMLElement | null) => void;
}

function NewsListComponent({
  articles,
  loading = false,
  loadingMore = false,
  hasMore = false,
  emptyStateType = 'general',
  searchQuery,
  category,
  onReset,
  onLoadMoreRef,
}: NewsListProps) {
  const uniqueArticles = useMemo(() => {
    const seen = new Set<string>();
    return articles.filter((article) => {
      if (seen.has(article.url)) {
        return false;
      }
      seen.add(article.url);
      return true;
    });
  }, [articles]);

  if (loading && articles.length === 0) {
    return (
      <div className="news-list news-list--loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Завантаження новин...</p>
        </div>
      </div>
    );
  }

  if (uniqueArticles.length === 0 && !loading) {
    return (
      <div className="news-list news-list--empty">
        <EmptyState
          type={emptyStateType}
          searchQuery={searchQuery}
          category={category}
          onReset={onReset}
        />
      </div>
    );
  }

  return (
    <>
      <div className="news-list">
        {uniqueArticles.map((article) => (
          <NewsCard key={article.url} article={article} />
        ))}
      </div>
      {hasMore && (
        <div
          ref={onLoadMoreRef}
          className="news-list__sentinel"
          aria-hidden
        />
      )}
      {loadingMore && (
        <div className="news-list__loading-more">
          <div className="loading-spinner">
            <div className="spinner spinner--small"></div>
            <p>Завантаження більше новин...</p>
          </div>
        </div>
      )}
      {!hasMore && uniqueArticles.length > 0 && (
        <div className="news-list__end">
          <p>Всі новини завантажено</p>
        </div>
      )}
    </>
  );
}

export const NewsList = memo(NewsListComponent);
