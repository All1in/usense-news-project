import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NewsList } from './components/NewsList';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import NewsDetail from './components/NewsDetail';
import { useNews } from './hooks/useNews';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { NewsProvider, useNewsContext } from './context/NewsContext';
import type { NewsCategory } from './types/news';
import './App.css';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const {
    articles,
    loading,
    loadingMore,
    error,
    hasMore,
    fetchNews,
    loadMore,
    reset,
  } = useNews();
  const { setArticles } = useNewsContext();
  const previousSearchQueryRef = useRef<string>('');
  const previousCategoryRef = useRef<NewsCategory | 'all'>('all');

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onLoadMore: loadMore,
  });

  useEffect(() => {
    const searchChanged = searchQuery !== previousSearchQueryRef.current;
    const categoryChanged = selectedCategory !== previousCategoryRef.current;

    if (searchChanged || categoryChanged) {
      reset();
      previousSearchQueryRef.current = searchQuery;
      previousCategoryRef.current = selectedCategory;
    }

    if (searchQuery.trim()) {
      fetchNews({ query: searchQuery.trim() });
    } else if (selectedCategory === 'all') {
      fetchNews({ country: 'us' });
    } else {
      fetchNews({ category: selectedCategory });
    }
  }, [searchQuery, selectedCategory, fetchNews, reset]);

  useEffect(() => {
    if (articles.length > 0) {
      setArticles(articles);
    }
  }, [articles, setArticles]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('all');
  };

  const handleCategoryChange = (category: NewsCategory | 'all') => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    reset();
  };

  const getEmptyStateType = (): 'search' | 'category' | 'general' => {
    if (searchQuery.trim()) return 'search';
    if (selectedCategory !== 'all') return 'category';
    return 'general';
  };

  const getCategoryLabel = (): string | undefined => {
    if (selectedCategory === 'all') return undefined;
    const labels: Record<NewsCategory, string> = {
      business: 'Бізнес',
      entertainment: 'Розваги',
      general: 'Загальні',
      health: 'Здоров\'я',
      science: 'Наука',
      sports: 'Спорт',
      technology: 'Технології',
    };
    return labels[selectedCategory];
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Новини світу</h1>
        <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}
        <NewsList
          articles={articles}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          emptyStateType={getEmptyStateType()}
          searchQuery={searchQuery}
          category={getCategoryLabel()}
          onReset={handleReset}
          onLoadMoreRef={loadMoreRef}
        />
      </main>
    </div>
  );
}

function App() {
  return (
    <NewsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news/:id" element={<NewsDetail />} />
        </Routes>
      </BrowserRouter>
    </NewsProvider>
  );
}

export default App;
