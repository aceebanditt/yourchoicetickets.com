"use client";

import { SearchBar } from "@/components/search/search-bar";

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Get Tickets to the Best Events
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Sports, concerts, theater, and more. Find your next experience.
        </p>
        <SearchBar />
      </div>
    </section>
  );
}