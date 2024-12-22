"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";

interface MobileNavProps {
  isOpen: boolean;
  navigation: Array<{ name: string; href: string }>;
}

export function MobileNav({ isOpen, navigation }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <SearchBar />
        <div className="flex flex-col space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Button className="w-full">Sign In</Button>
        </div>
      </div>
    </div>
  );
}