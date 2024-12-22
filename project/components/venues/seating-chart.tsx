"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { VenueSection } from '@/lib/types';

interface SeatingChartProps {
  sections: VenueSection[];
  onSectionSelect: (sectionId: string) => void;
  selectedSection?: string;
}

export function SeatingChart({ sections, onSectionSelect, selectedSection }: SeatingChartProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-[16/9] bg-muted rounded-lg overflow-hidden">
      <svg
        viewBox="0 0 1000 562.5"
        className="w-full h-full"
      >
        {sections.map((section) => (
          <g
            key={section.id}
            onClick={() => onSectionSelect(section.id)}
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
            className={cn(
              "cursor-pointer transition-colors",
              hoveredSection === section.id && "opacity-80",
              selectedSection === section.id && "fill-primary stroke-primary-foreground"
            )}
          >
            {/* Section paths will be added when implementing specific venue layouts */}
            <path d="..." />
            <text
              x="500"
              y="281.25"
              textAnchor="middle"
              className="text-xs fill-current"
            >
              {section.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}