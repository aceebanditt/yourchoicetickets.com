"use client";

import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryFilters } from "@/hooks/use-category-filters";
import { Card } from "@/components/ui/card";

interface CategoryFiltersProps {
  initialFilters?: {
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    date?: string;
    featured?: boolean;
  };
}

export function CategoryFilters({ initialFilters }: CategoryFiltersProps) {
  const { filters, updateFilter } = useCategoryFilters(initialFilters);

  return (
    <Card className="p-4 space-y-6">
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select
          value={filters.sort}
          onValueChange={(value) => updateFilter("sort", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date:asc">Date: Earliest First</SelectItem>
            <SelectItem value="date:desc">Date: Latest First</SelectItem>
            <SelectItem value="price:asc">Price: Low to High</SelectItem>
            <SelectItem value="price:desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Price Range</Label>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={[filters.minPrice || 0, filters.maxPrice || 1000]}
          onValueChange={([min, max]) => {
            updateFilter("minPrice", min);
            updateFilter("maxPrice", max);
          }}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${filters.minPrice || 0}</span>
          <span>${filters.maxPrice || 1000}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Calendar
          mode="single"
          selected={filters.date ? new Date(filters.date) : undefined}
          onSelect={(date) => updateFilter("date", date?.toISOString())}
          className="rounded-md border"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={filters.featured}
          onCheckedChange={(checked) => updateFilter("featured", checked)}
        />
        <Label>Featured Events Only</Label>
      </div>
    </Card>
  );
}