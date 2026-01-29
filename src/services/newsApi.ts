import type { NewsApiResponse, NewsApiError, NewsSearchParams, NewsCategory } from '../types/news';

const API_BASE_URL = 'https://newsapi.org/v2';
const API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';

if (!API_KEY) {
  console.warn('VITE_NEWS_API_KEY is not set. Please add it to your .env file.');
}

class NewsApiService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.apiKey = API_KEY;
  }

  private async fetchNews<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const queryParams = new URLSearchParams({
      ...params,
      apiKey: this.apiKey,
    });

    const url = `${this.baseUrl}${endpoint}?${queryParams.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData: NewsApiError = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while fetching news');
    }
  }

  async getTopHeadlines(params: NewsSearchParams = {}): Promise<NewsApiResponse> {
    const { query, category, country, page = 1, pageSize = 20 } = params;

    const apiParams: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (category) {
      apiParams.category = category;
    }

    if (query) {
      apiParams.q = query;
    }

    if (country) {
      apiParams.country = country;
    }

    if (!category && !query && !country) {
      apiParams.country = 'us';
    }

    return this.fetchNews<NewsApiResponse>('/top-headlines', apiParams);
  }

  async searchNews(query: string, page: number = 1, pageSize: number = 20): Promise<NewsApiResponse> {
    return this.fetchNews<NewsApiResponse>('/everything', {
      q: query,
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy: 'publishedAt',
    });
  }

  async getNewsByCategory(category: NewsCategory, page: number = 1, pageSize: number = 20): Promise<NewsApiResponse> {
    return this.getTopHeadlines({ category, page, pageSize });
  }
}

export const newsApiService = new NewsApiService();
