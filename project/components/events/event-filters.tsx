"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function EventFilters() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [priceRange, setPriceRange] = useState([0, 1000]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="date">
            <AccordionTrigger>Date</AccordionTrigger>
            <AccordionContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  step={10}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {["Sports", "Concerts", "Theater", "Comedy"].map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={category}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={category} className="ml-2">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}