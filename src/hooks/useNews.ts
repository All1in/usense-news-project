import { useState, useCallback, useRef } from 'react';
import type { NewsArticle, NewsSearchParams } from '../types/news';
import { newsApiService } from '../services/newsApi';

interface UseNewsState {
  articles: NewsArticle[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  totalResults: number;
  hasMore: boolean;
  currentPage: number;
}

interface UseNewsReturn extends UseNewsState {
  fetchNews: (params: NewsSearchParams, append?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

const DEFAULT_PAGE_SIZE = 20;

export function useNews(): UseNewsReturn {
  const currentParamsRef = useRef<NewsSearchParams>({});
  const currentPageRef = useRef<number>(1);
  const isLoadingMoreRef = useRef<boolean>(false);

  const [state, setState] = useState<UseNewsState>({
    articles: [],
    loading: false,
    loadingMore: false,
    error: null,
    totalResults: 0,
    hasMore: false,
    currentPage: 1,
  });

  const fetchNews = useCallback(async (params: NewsSearchParams, append = false) => {
    currentParamsRef.current = params;

    if (append) {
      isLoadingMoreRef.current = true;
      setState((prev) => ({ ...prev, loadingMore: true, error: null }));
    } else {
      currentPageRef.current = 1;
      setState((prev) => ({ 
        ...prev, 
        loading: true, 
        error: null,
        currentPage: 1,
        articles: [],
      }));
    }

    try {
      const page = append ? currentPageRef.current + 1 : (params.page || 1);
      const pageSize = params.pageSize || DEFAULT_PAGE_SIZE;
      
      const requestParams = { ...params, page, pageSize };
      
      const response = requestParams.query
        ? await newsApiService.searchNews(requestParams.query, page, pageSize)
        : await newsApiService.getTopHeadlines(requestParams);

      setState((prev) => {
        const newArticles = append 
          ? [...prev.articles, ...response.articles]
          : response.articles;
        
        const hasMore = newArticles.length < response.totalResults;
        currentPageRef.current = page;
        isLoadingMoreRef.current = false;

        return {
          articles: newArticles,
          loading: false,
          loadingMore: false,
          error: null,
          totalResults: response.totalResults,
          hasMore,
          currentPage: page,
        };
      });
    } catch (error) {
      isLoadingMoreRef.current = false;
      setState((prev) => ({
        ...prev,
        loading: false,
        loadingMore: false,
        error: error instanceof Error ? error.message : 'Failed to fetch news',
      }));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMoreRef.current || !state.hasMore) return;
    await fetchNews(currentParamsRef.current, true);
  }, [state.hasMore, fetchNews]);

  const reset = useCallback(() => {
    currentParamsRef.current = {};
    currentPageRef.current = 1;
    setState({
      articles: [],
      loading: false,
      loadingMore: false,
      error: null,
      totalResults: 0,
      hasMore: false,
      currentPage: 1,
    });
  }, []);

  return {
    ...state,
    fetchNews,
    loadMore,
    reset,
  };
}
