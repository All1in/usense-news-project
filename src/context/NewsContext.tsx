import { createContext, useContext, useState, ReactNode } from 'react';
import type { NewsArticle } from '../types/news';

interface NewsContextValue {
  articles: NewsArticle[];
  setArticles: (articles: NewsArticle[]) => void;
  getArticleByUrl: (url: string) => NewsArticle | undefined;
}

const NewsContext = createContext<NewsContextValue | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  console.log('articles', articles)

  const getArticleByUrl = (url: string): NewsArticle | undefined => {
    return articles.find((article) => article.url === url);
  };

  return (
    <NewsContext.Provider value={{ articles, setArticles, getArticleByUrl }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNewsContext(): NewsContextValue {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNewsContext must be used within a NewsProvider');
  }
  return context;
}
