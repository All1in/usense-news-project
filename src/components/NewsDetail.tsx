import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNewsContext } from '../context/NewsContext';
import { ImageWithFallback } from './ImageWithFallback';
import type { NewsArticle } from '../types/news';

function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleByUrl } = useNewsContext();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    try {
      const url = decodeURIComponent(id);
      const foundArticle = getArticleByUrl(url);

      if (foundArticle) {
        setArticle(foundArticle);
        setLoading(false);
      } else {
        setError('Новину не знайдено. Будь ласка, поверніться до списку новин.');
        setLoading(false);
      }
    } catch (err) {
      setError('Помилка при завантаженні новини');
      setLoading(false);
    }
  }, [id, navigate, getArticleByUrl]);

  const formatDate = (dateString: string): string => {
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

  if (loading) {
    return (
      <div className="news-detail news-detail--loading">
        <div className="loading-spinner">Завантаження новини...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-detail news-detail--error">
        <p className="error-message">{error}</p>
        <Link to="/" className="back-link">
          Повернутися до списку новин
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="news-detail news-detail--not-found">
        <p>Новину не знайдено</p>
        <Link to="/" className="back-link">
          Повернутися до списку новин
        </Link>
      </div>
    );
  }

  return (
    <article className="news-detail">
      <Link to="/" className="back-link">
        ← Повернутися до списку новин
      </Link>

      <div className="news-detail__image-container">
        <ImageWithFallback
          src={article.urlToImage}
          alt={article.title}
          className="news-detail__image"
        />
      </div>

      <div className="news-detail__content">
        <h1 className="news-detail__title">{article.title}</h1>

        <div className="news-detail__meta">
          <span className="news-detail__source">{article.source.name}</span>
          {article.author && (
            <span className="news-detail__author">Автор: {article.author}</span>
          )}
          <time className="news-detail__date" dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        </div>

        {article.description && (
          <p className="news-detail__description">{article.description}</p>
        )}

        {article.content && (
          <div className="news-detail__body">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="news-detail__external-link"
        >
          Читати повну статтю →
        </a>
      </div>
    </article>
  );
}

export default NewsDetail;
