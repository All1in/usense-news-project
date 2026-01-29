import { useState, useCallback, memo } from 'react';

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f0f0f0" width="400" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EЗображення недоступне%3C/text%3E%3C/svg%3E';

function ImageWithFallbackComponent({
  src,
  alt,
  className,
  loading = 'lazy',
  fallbackSrc = DEFAULT_FALLBACK,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(src);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  }, [hasError, fallbackSrc]);

  const handleLoad = useCallback(() => {
    setHasError(false);
  }, []);

  if (src !== imgSrc && !hasError) {
    setImgSrc(src);
  }

  if (!imgSrc) {
    return (
      <div className={`image-placeholder ${className || ''}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 400 200"
          className="image-placeholder__svg"
        >
          <rect fill="#f0f0f0" width="400" height="200" />
          <text
            fill="#999"
            fontFamily="sans-serif"
            fontSize="14"
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Зображення недоступне
          </text>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      onLoad={handleLoad}
      decoding="async"
    />
  );
}

export const ImageWithFallback = memo(ImageWithFallbackComponent);
