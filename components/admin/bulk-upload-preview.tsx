"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Event } from "@/lib/types/event";

interface BulkUploadPreviewProps {
  data: Partial<Event>[];
  validationErrors?: Array<{
    index: number;
    path: string;
    message: string;
  }>;
}

export function BulkUploadPreview({ data, validationErrors }: BulkUploadPreviewProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const getRowErrors = (index: number) => 
    validationErrors?.filter(error => error.index === index) || [];

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Row</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice((page - 1) * pageSize, page * pageSize).map((item, index) => {
              const rowIndex = (page - 1) * pageSize + index;
              const errors = getRowErrors(rowIndex);
              
              return (
                <TableRow key={rowIndex} className={errors.length ? "bg-destructive/10" : ""}>
                  <TableCell>{rowIndex + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    {errors.length > 0 ? (
                      <Badge variant="destructive">
                        {errors.length} {errors.length === 1 ? "Error" : "Errors"}
                      </Badge>
                    ) : (
                      <Badge variant="success">Valid</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {validationErrors && validationErrors.length > 0 && (
        <div className="bg-destructive/10 p-4 rounded-lg space-y-2">
          <h3 className="font-semibold">Validation Errors</h3>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm">
                Row {error.index + 1}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}