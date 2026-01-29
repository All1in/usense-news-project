import { memo } from 'react';

interface EmptyStateProps {
  type: 'search' | 'category' | 'general';
  searchQuery?: string;
  category?: string;
  onReset?: () => void;
}

function EmptyStateComponent({ type, searchQuery, category, onReset }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: '🔍',
          title: 'Нічого не знайдено',
          message: searchQuery
            ? `За запитом "${searchQuery}" новин не знайдено.`
            : 'Спробуйте інші ключові слова для пошуку.',
          suggestions: [
            'Перевірте правильність написання',
            'Спробуйте більш загальні терміни',
            'Використовуйте англійську мову для пошуку',
          ],
        };
      case 'category':
        return {
          icon: '📰',
          title: 'Новин у цій категорії немає',
          message: category
            ? `На жаль, новин у категорії "${category}" зараз немає.`
            : 'Спробуйте вибрати іншу категорію.',
          suggestions: [
            'Перегляньте інші категорії',
            'Спробуйте пошук за ключовими словами',
            'Перевірте новини пізніше',
          ],
        };
      default:
        return {
          icon: '📭',
          title: 'Новини відсутні',
          message: 'На даний момент новин немає. Спробуйте пізніше.',
          suggestions: [
            'Перевірте інтернет-з\'єднання',
            'Спробуйте оновити сторінку',
            'Перевірте інші категорії',
          ],
        };
    }
  };

  const content = getContent();

  return (
    <div className="empty-state">
      <div className="empty-state__icon">{content.icon}</div>
      <h2 className="empty-state__title">{content.title}</h2>
      <p className="empty-state__message">{content.message}</p>
      {content.suggestions && content.suggestions.length > 0 && (
        <div className="empty-state__suggestions">
          <p className="empty-state__suggestions-title">Можливо, вам допоможе:</p>
          <ul className="empty-state__suggestions-list">
            {content.suggestions.map((suggestion, index) => (
              <li key={index} className="empty-state__suggestion">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      {onReset && (
        <button type="button" className="empty-state__button" onClick={onReset}>
          Показати всі новини
        </button>
      )}
    </div>
  );
}

export const EmptyState = memo(EmptyStateComponent);
