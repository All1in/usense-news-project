import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { NewsArticle } from '../types/news';
import { ImageWithFallback } from './ImageWithFallback';

interface NewsCardProps {
  article: NewsArticle;
}

function NewsCardComponent({ article }: NewsCardProps) {
  const formatDate = useMemo(() => {
    return (dateString: string): string => {
      try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('uk-UA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
      } catch {
        return dateString;
      }
    };
  }, []);

  const formattedDate = useMemo(
    () => formatDate(article.publishedAt),
    [article.publishedAt, formatDate]
  );

  const articleId = useMemo(
    () => encodeURIComponent(article.url),
    [article.url]
  );

  return (
    <article className="news-card">
      <div className="news-card__image-container">
        <ImageWithFallback
          src={article.urlToImage}
          alt={article.title}
          className="news-card__image"
          loading="lazy"
        />
      </div>
      <div className="news-card__content">
        <h2 className="news-card__title">
          <Link to={`/news/${articleId}`} className="news-card__link">
            {article.title}
          </Link>
        </h2>
        {article.description && (
          <p className="news-card__description">{article.description}</p>
        )}
        <div className="news-card__meta">
          <span className="news-card__source">{article.source.name}</span>
          <time className="news-card__date" dateTime={article.publishedAt}>
            {formattedDate}
          </time>
        </div>
      </div>
    </article>
  );
}

export const NewsCard = memo(NewsCardComponent);
