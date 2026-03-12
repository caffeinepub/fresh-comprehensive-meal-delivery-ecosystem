import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  fallbackSrc?: string;
  priority?: boolean;
}

export default function LazyImage({
  src,
  alt,
  className,
  placeholderClassName,
  onLoad,
  onError,
  threshold = 0.1,
  fallbackSrc = "/assets/generated/fresh-logo.dim_200x200.png",
  priority = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Skip intersection observer for priority images
    if (priority || !imgRef.current) {
      setIsInView(true);
      return;
    }

    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin: "100px", // Start loading 100px before image enters viewport
      },
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {/* Placeholder with shimmer effect */}
      {!isLoaded && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30",
            "animate-shimmer bg-[length:200%_100%]",
            placeholderClassName,
          )}
        />
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={hasError ? fallbackSrc : src}
          alt={alt}
          className={cn(
            "transition-opacity duration-500 ease-out",
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      )}
    </div>
  );
}
