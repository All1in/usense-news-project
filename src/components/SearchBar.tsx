import { memo, useState, useEffect, FormEvent, ChangeEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

function SearchBarComponent({ onSearch, initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="search"
        className="search-bar__input"
        placeholder="Пошук новин за ключовими словами..."
        value={query}
        onChange={handleChange}
        aria-label="Пошук новин"
      />
      <button type="submit" className="search-bar__button">
        Пошук
      </button>
    </form>
  );
}

export const SearchBar = memo(SearchBarComponent);
