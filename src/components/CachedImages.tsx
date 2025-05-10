import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

// Cache duration for images (2 days in milliseconds)
const CACHE_DURATION = 2 * 24 * 60 * 60 * 1000;

// This interface extends Next.js Image props
interface CachedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  cacheKey?: string;
}

const CachedImage = ({ 
  src, 
  fallbackSrc = 'https://via.placeholder.com/300x300?text=No+Image', 
  cacheKey,
  alt,
  ...props 
}: CachedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src || fallbackSrc);
  
  useEffect(() => {
    // If no source provided, use fallback
    if (!src) {
      setImageSrc(fallbackSrc);
      return;
    }
    
    // Check if we have a cached version in localStorage
    const storageKey = `img_cache_${cacheKey || src}`;
    const cachedImage = localStorage.getItem(storageKey);
    
    if (cachedImage) {
      try {
        const { url, timestamp } = JSON.parse(cachedImage);
        const currentTime = new Date().getTime();
        
        // If cached image is still valid (less than 2 days old)
        if (currentTime - timestamp < CACHE_DURATION) {
          setImageSrc(url);
          return;
        }
      } catch (error) {
        console.error('Error parsing cached image data:', error);
      }
    }
    
    // If no valid cache, use the provided source
    setImageSrc(src);
    
    // Create a timestamp for the cache
    const currentTime = new Date().getTime();
    
    // Cache the image URL in localStorage
    localStorage.setItem(storageKey, JSON.stringify({
      url: src,
      timestamp: currentTime
    }));
    
  }, [src, fallbackSrc, cacheKey]);
  
  // Handle loading/error states
  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };
  
  return (
    <Image
      src={imageSrc}
      alt={alt}
      onError={handleError}
      {...props}
      loading="eager" // Eagerly load images that are visible in the viewport
      priority={props.priority || imageSrc === src} // Prioritize loading of actual source images
    />
  );
};

export default CachedImage;
