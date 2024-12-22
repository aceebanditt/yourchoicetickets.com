"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchBar } from "@/components/search/search-bar";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Sports", href: "/sports" },
  { name: "Concerts", href: "/concerts" },
  { name: "Theater", href: "/theater" },
  { name: "More", href: "/categories" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              EventSeats
            </Link>
          </div>

          <div className="hidden md:block flex-1 mx-8">
            <SearchBar />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button variant="ghost" size="sm" className="text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              New York
            </Button>
            <Button>Sign In</Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>
      <MobileNav isOpen={isOpen} navigation={navigation} />
    </header>
  );
}