"use client";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function SearchFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="date">
            <AccordionTrigger>Date</AccordionTrigger>
            <AccordionContent>
              <Calendar mode="single" className="rounded-md border" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider defaultValue={[0]} max={1000} step={10} />
                <div className="flex justify-between text-sm">
                  <span>$0</span>
                  <span>$1000+</span>
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