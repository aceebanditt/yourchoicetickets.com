import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedEvents } from "@/components/events/featured-events";
import { CategorySection } from "@/components/categories/category-section";

const sportsCategories = [
  {
    id: "mlb",
    name: "MLB",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop",
    url: "/sports/mlb",
  },
  {
    id: "nba",
    name: "NBA",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&h=600&fit=crop",
    url: "/sports/nba",
  },
  {
    id: "nfl",
    name: "NFL",
    image: "https://images.unsplash.com/photo-1508147077495-41d2f37e63f5?w=800&h=600&fit=crop",
    url: "/sports/nfl",
  },
  {
    id: "nhl",
    name: "NHL",
    image: "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800&h=600&fit=crop",
    url: "/sports/nhl",
  },
];

const concertCategories = [
  {
    id: "rock",
    name: "Rock",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop",
    url: "/concerts/rock",
  },
  {
    id: "pop",
    name: "Pop",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop",
    url: "/concerts/pop",
  },
  {
    id: "hiphop",
    name: "Hip Hop",
    image: "https://images.unsplash.com/photo-1547355253-ff0740f6e8c1?w=800&h=600&fit=crop",
    url: "/concerts/hip-hop",
  },
  {
    id: "country",
    name: "Country",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop",
    url: "/concerts/country",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSlider />
      
      <div className="py-12 space-y-16">
        <FeaturedEvents />
        <CategorySection title="Sports" categories={sportsCategories} />
        <CategorySection title="Concerts" categories={concertCategories} />
      </div>
    </main>
  );
}