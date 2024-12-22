"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface EventGalleryProps {
  images: Array<{
    url: string;
    ratio: string;
    width: number;
    height: number;
  }>;
}

export function EventGallery({ images }: EventGalleryProps) {
  const filteredImages = images.filter(img => img.ratio === "16_9");

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {filteredImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={image.url}
                alt=""
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}