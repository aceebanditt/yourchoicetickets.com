"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: "NBA Games",
    subtitle: "Experience the thrill of live basketball",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1200&h=628&fit=crop",
    category: "Sports",
    date: "2024-04-15",
  },
  {
    id: 2,
    title: "Taylor Swift | The Eras Tour",
    subtitle: "Don't miss the concert of the year",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=628&fit=crop",
    category: "Concerts",
    date: "2024-05-20",
  },
  {
    id: 3,
    title: "Hamilton",
    subtitle: "Broadway's biggest hit musical",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&h=628&fit=crop",
    category: "Theater",
    date: "2024-06-10",
  },
  {
    id: 4,
    title: "Dave Chappelle Live",
    subtitle: "An evening of stand-up comedy",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&h=628&fit=crop",
    category: "Comedy",
    date: "2024-04-30",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[628px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <div className="max-w-3xl">
                <div className="mb-2 text-sm font-medium uppercase tracking-wider">
                  {slide.category} • {new Date(slide.date).toLocaleDateString()}
                </div>
                <h2 className="mb-4 text-4xl font-bold">{slide.title}</h2>
                <p className="mb-6 text-xl">{slide.subtitle}</p>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Tickets
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentSlide ? "bg-white w-6" : "bg-white/50"
            )}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}