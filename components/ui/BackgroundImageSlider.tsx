"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BackgroundImageSliderProps {
  images: string[];
  interval?: number;
  className?: string;
}

export function BackgroundImageSlider({
  images,
  interval = 5000,
  className = "",
}: BackgroundImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Циклическая смена изображений
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Fallback фон (градиент как в оригинале) - показывается пока не загрузится первое изображение */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-sand-100 to-sand-50 transition-opacity duration-1000 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />
      
      {/* Все изображения с анимацией перехода */}
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`Background ${index + 1}`}
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover object-center"
            onLoadingComplete={() => {
              if (index === 0) setIsLoaded(true);
            }}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
          />
          {/* Градиентное затемнение для лучшей читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
        </div>
      ))}
    </div>
  );
}
