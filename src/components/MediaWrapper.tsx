import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface MediaWrapperProps {
  src: string;
  alt?: string;
  className?: string;
  type?: "image" | "video";
  fallbackSrc?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  onClick?: () => void;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80";

export const MediaWrapper: React.FC<MediaWrapperProps> = ({
  src,
  alt = "",
  className = "",
  type = "image",
  fallbackSrc = DEFAULT_FALLBACK,
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false,
  onClick,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || (type === "image" ? fallbackSrc : ""));
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Loading...");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setCurrentSrc(src || (type === "image" ? fallbackSrc : ""));
    setIsLoading(true);
    setHasError(false);
  }, [src, type, fallbackSrc]);

  const handleRetry = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsLoading(true);
    setHasError(false);
    setStatusMessage("Retrying...");
    setRetryKey((prev) => prev + 1);
  };

  const handleError = () => {
    setIsLoading(false);
    if (type === "image") {
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setHasError(true);
        setStatusMessage("Retrying fallback...");
      } else {
        setHasError(true);
        setStatusMessage("Failed to load");
      }
    } else {
      setHasError(true);
      setStatusMessage("Video failed to load");
    }
  };

  return (
    <div className={`relative overflow-hidden bg-sand/30 flex items-center justify-center ${className}`} onClick={onClick}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 backdrop-blur-xs text-white text-xs font-mono gap-1 pointer-events-none transition-opacity">
          <Loader2 className="w-4 h-4 animate-spin text-brass" />
          <span>{statusMessage}</span>
        </div>
      )}

      {hasError && !isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 text-white text-xs font-mono gap-2 p-2 text-center">
          <span>{statusMessage}</span>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1 bg-brass hover:bg-brass/90 text-stone-950 px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Retry
          </button>
        </div>
      )}

      {type === "image" ? (
        <img
          key={retryKey}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onError={handleError}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoading ? "blur-md scale-105 opacity-80" : "blur-0 scale-100 opacity-100"
          }`}
        />
      ) : (
        <video
          key={retryKey}
          src={currentSrc}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
          onLoadedData={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onError={handleError}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoading ? "blur-sm opacity-60" : "blur-0 opacity-100"
          }`}
        />
      )}
    </div>
  );
};
