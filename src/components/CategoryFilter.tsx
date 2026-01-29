import { memo } from 'react';
import type { NewsCategory } from '../types/news';

const CATEGORIES: Array<{ value: NewsCategory | 'all'; label: string }> = [
  { value: 'all', label: 'Всі новини' },
  { value: 'business', label: 'Бізнес' },
  { value: 'entertainment', label: 'Розваги' },
  { value: 'general', label: 'Загальні' },
  { value: 'health', label: 'Здоров\'я' },
  { value: 'science', label: 'Наука' },
  { value: 'sports', label: 'Спорт' },
  { value: 'technology', label: 'Технології' },
];

interface CategoryFilterProps {
  selectedCategory: NewsCategory | 'all';
  onCategoryChange: (category: NewsCategory | 'all') => void;
}

function CategoryFilterComponent({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          type="button"
          className={`category-filter__button ${
            selectedCategory === category.value ? 'category-filter__button--active' : ''
          }`}
          onClick={() => onCategoryChange(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

export const CategoryFilter = memo(CategoryFilterComponent);
