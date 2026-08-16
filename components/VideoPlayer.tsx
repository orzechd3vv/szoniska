'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaPlay } from 'react-icons/fa';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({ src, poster, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const requestRef = useRef<number>();

  const animate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    setHasError(false);
    setIsPlaying(false);
    setProgress(0);
  }, [src]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => setHasError(true));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !videoRef.current.duration || hasError) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(percentage * 100);
  };

  if (hasError) {
    return (
      <div className={`relative flex flex-col items-center justify-center bg-gray-900 rounded-[2.5rem] p-8 text-center ${className}`}>
        <FaExclamationTriangle size={40} className="text-red-500 mb-4" />
        <h3 className="text-white font-black uppercase text-xs tracking-widest mb-2">Błąd odtwarzania</h3>
        <p className="text-gray-500 text-[10px] uppercase leading-relaxed">Format wideo może być nieobsługiwany przez Twoją przeglądarkę</p>
      </div>
    );
  }

  // Function to optimize Cloudinary URLs for compatibility
  const getOptimizedSrc = (url: string) => {
    if (url.includes('cloudinary.com') && url.includes('/video/upload/')) {
      return url.replace('/video/upload/', '/video/upload/f_auto,q_auto/');
    }
    return url;
  };

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div className={`relative group bg-black overflow-hidden rounded-[2.5rem] ${className}`}>
      <video
        key={optimizedSrc}
        ref={videoRef}
        src={optimizedSrc}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        onLoadedData={(e) => {
          e.currentTarget.currentTime = 0.1;
        }}
        playsInline
        preload="metadata"
        muted
        loop
      />

      {/* Ultra Minimalist Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 cursor-pointer group/progress z-20"
        onClick={handleSeek}
      >
        <div 
          className="h-full bg-primary-600 shadow-[0_0_15px_rgba(139,92,246,0.8)] relative transition-all"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute top-0 right-0 h-full w-2 bg-primary-400 blur-[2px] opacity-70" />
        </div>
      </div>

      {/* Simple Play Overlay */}
      <AnimatePresence>
        {!isPlaying && !hasError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 z-10"
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <FaPlay className="text-white ml-1" size={24} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
