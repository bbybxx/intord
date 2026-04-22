"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const safeImages = useMemo(() => {
    return images.length > 0 ? images : ["/images/fallback.jpg"];
  }, [images]);

  const [activeImage, setActiveImage] = useState(safeImages[0]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand-50 md:aspect-[4/5] max-w-full">
        <Image
          src={activeImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
          onError={(e) => {
            // Если изображение не загружается, заменяем на fallback
            const target = e.target as HTMLImageElement;
            target.src = '/images/fallback.jpg';
          }}
        />
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {safeImages.map((image, index) => {
          const active = image === activeImage;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border md:h-20 md:w-16 ${
                active ? "border-ink" : "border-sand-200"
              }`}
              aria-label={`Открыть фото ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${title} ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 48px, 80px"
                onError={(e) => {
                  // Если миниатюра не загружается, заменяем на fallback
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/fallback.jpg';
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
