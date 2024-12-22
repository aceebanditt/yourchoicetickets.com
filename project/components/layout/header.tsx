"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Sports", href: "/sports" },
    { name: "Concerts", href: "/concerts" },
    { name: "Theater", href: "/theater" },
    { name: "More", href: "/categories" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">EventSeats</span>
            </Link>
          </div>

          <div className="hidden md:block flex-1 mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events, venues, or cities"
                className="w-full pl-10 pr-4"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              New York
            </Button>
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
            <ModeToggle />
          </div>

          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <div className="hidden md:flex space-x-8 py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events, venues, or cities"
                  className="w-full pl-10 pr-4"
                />
              </div>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block text-base font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="space-y-2 pt-4">
                <Button className="w-full" variant="outline">
                  Sign In
                </Button>
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}