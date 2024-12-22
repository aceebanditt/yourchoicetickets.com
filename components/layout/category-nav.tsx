"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Sports", href: "/sports" },
  { name: "Concerts", href: "/concerts" },
  { name: "Theater", href: "/theater" },
  { name: "Comedy", href: "/comedy" },
];

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 py-4">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === category.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}